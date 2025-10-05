import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	signalStore,
	withState,
	withComputed,
	withMethods,
	patchState,
	withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect } from '@angular/core';
import { IdentityState, initialIdentityState } from './identity.state';
import { IdentityService } from '../../services/identity/identity-service';
import { TenantResponse } from '../../types/tenant/tenant-response';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { catchError, tap, take } from 'rxjs/operators';
import { EMPTY, switchMap, Observable } from 'rxjs';
import { STORE_FEATURE } from '../features';
import { Role } from '../../types/identity/roles';
import { UserCreateRequest } from '../../types/user/user-create-request';
import { UserUpdateRequest } from '../../types/user/user-update-request';
import { ROUTES } from '../../app.routes';

export const IdentityStore = signalStore(
	withState<IdentityState>(initialIdentityState),

	withComputed((store) => ({
		userLabel: computed(() => `${store.name?.() ?? ''} ${store.surname?.() ?? ''}`.trim()),
		// Users only have one role *_*
		userMainRole: computed(() => store.roles()?.[0] || 'Unknown role wtf?'),
		roleOptions: computed(() =>
			(store.availableRoles?.() ?? []).map((r) => ({
				id: r,
				label: (Role as Record<string, string>)[r] ?? r,
			})),
		),
		authHeaders: computed<Record<string, string>>(() => {
			const token = store.accessToken?.();
			const type = store.tokenType?.();
			return token && type ? { Authorization: `${type} ${token}` } : ({} as Record<string, string>);
		}),
		tenantsTotalAdmins: computed(() =>
			(store.tenants?.() ?? []).reduce((sum, tenant) => sum + (tenant?.adminCount ?? 0), 0),
		),
		tenantsTotalEmployees: computed(() =>
			(store.tenants?.() ?? []).reduce((sum, tenant) => sum + (tenant?.employeeCount ?? 0), 0),
		),
		tenantsTotalCustomers: computed(() =>
			(store.tenants?.() ?? []).reduce((sum, tenant) => sum + (tenant?.customerCount ?? 0), 0),
		),
	})),

	withMethods((store, identityService = inject(IdentityService), router = inject(Router)) => {
		const simpleEffect = (fn: () => void) => fn;

		// Effect after authentication
		const navigateToDashboard = simpleEffect(() => {
			router.navigate([ROUTES.DASHBOARD]);
		});

		// Effect after logout
		const navigateToAuth = simpleEffect(() => {
			router.navigate([ROUTES.AUTH]);
		});

		return {
			setCurrentTenant(value: TenantResponse | null): void {
				patchState(store, { currentTenant: value });
			},
			resolveCurrentTenant(): void {
				identityService
					.getTenantByDomain()
					.pipe(take(1))
					.subscribe({
						next: (tenant) => {
							patchState(store, { currentTenant: tenant });
						},
						error: () => {
							patchState(store, { currentTenant: null });
						},
					});
			},
			loadUserRoles: rxMethod<void>((trigger$) =>
				trigger$.pipe(
					switchMap(() =>
						identityService.getUserRoles().pipe(
							tap((roles) => patchState(store, { availableRoles: roles })),
							catchError(() => {
								patchState(store, { availableRoles: [] });
								return EMPTY;
							}),
						),
					),
				),
			),
			login: rxMethod<AuthenticationRequest>((credentials$: Observable<AuthenticationRequest>) =>
				credentials$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((credentials) =>
						identityService.login(credentials).pipe(
							tap((authResponse) => {
								patchState(store, {
									username: authResponse.username,
									name: authResponse.name,
									surname: authResponse.surname,
									isAuthenticated: true,
									roles: authResponse.roles,
									accessToken: authResponse.accessToken,
									refreshToken: authResponse.refreshToken,
									tokenType: authResponse.tokenType,
									error: null,
									loading: false,
								});

								navigateToDashboard();
							}),
							catchError((error) => {
								patchState(store, {
									username: null,
									name: null,
									surname: null,
									isAuthenticated: false,
									roles: [],
									accessToken: null,
									refreshToken: null,
									tokenType: null,
									error: error?.message || 'Login failed',
									loading: false,
								});
								return EMPTY;
							}),
						),
					),
				),
			),

			refreshAuthToken: rxMethod<string>((refreshToken$: Observable<string>) =>
				refreshToken$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((refreshToken) =>
						identityService.refreshToken(refreshToken).pipe(
							tap((authResponse) => {
								patchState(store, {
									isAuthenticated: true,
									accessToken: authResponse.accessToken,
									refreshToken: authResponse.refreshToken,
									tokenType: authResponse.tokenType,
									error: null,
									loading: false,
								});
							}),
							catchError(() => {
								patchState(store, {
									username: null,
									name: null,
									surname: null,
									isAuthenticated: false,
									accessToken: null,
									refreshToken: null,
									tokenType: null,
									error: 'Token refresh failed',
									loading: false,
								});
								return EMPTY;
							}),
						),
					),
				),
			),

			logout(): void {
				patchState(store, { ...initialIdentityState });
				navigateToAuth();
			},

			loadAllTenants: rxMethod<void>((trigger$) =>
				trigger$.pipe(
					switchMap(() =>
						// TODO: Implemenet pagination @_@
						identityService.getAllTenants(0, 100, 'updatedAt,ASC').pipe(
							tap((allTenantsRes) => {
								patchState(store, {
									tenants: allTenantsRes.content,
									tenantsTotalCount: allTenantsRes.totalElements,
								});
							}),
							catchError(() => {
								patchState(store, { tenants: [], tenantsTotalCount: 0 });
								return EMPTY;
							}),
						),
					),
				),
			),

			searchTenants: rxMethod<{ q: string; page?: number; size?: number; sort?: string }>(
				(params$) =>
					params$.pipe(
						switchMap(({ q, page = 0, size = 100, sort = 'updatedAt,ASC' }) =>
							identityService.searchTenant(q, page, size, sort).pipe(
								tap((results) => {
									patchState(store, {
										tenants: results.content,
										tenantsTotalCount: results?.totalElements ?? 0,
									});
								}),
								catchError(() => {
									patchState(store, { tenants: [], tenantsTotalCount: 0 });
									return EMPTY;
								}),
							),
						),
					),
			),

			createTenant: rxMethod<Partial<{ id: string; name: string; domain: string }>>((payload$) =>
				payload$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((payload) =>
						identityService.createTenant(payload).pipe(
							tap((tenant) => {
								const updated = [...store.tenants(), tenant];
								patchState(store, {
									tenants: updated,
									tenantsTotalCount: store.tenantsTotalCount() + 1,
									loading: false,
									error: null,
								});
							}),
							catchError((e) => {
								patchState(store, { loading: false, error: e?.message || 'Create tenant failed' });
								return EMPTY;
							}),
						),
					),
				),
			),

			updateTenant: rxMethod<{ id: string; changes: Partial<{ name: string; domain: string }> }>(
				(payload$) =>
					payload$.pipe(
						tap(() => patchState(store, { loading: true, error: null })),
						switchMap(({ id, changes }) =>
							identityService.updateTenant(id, changes).pipe(
								tap((updatedTenant) => {
									const list = store.tenants();
									const idx = list.findIndex((t) => t.id === id);
									if (idx >= 0) {
										const next = [...list];
										next[idx] = updatedTenant;
										patchState(store, { tenants: next, loading: false, error: null });
									} else {
										patchState(store, { loading: false, error: null });
									}
								}),
								catchError((e) => {
									patchState(store, {
										loading: false,
										error: e?.message || 'Update tenant failed',
									});
									return EMPTY;
								}),
							),
						),
					),
			),

			deleteTenant: rxMethod<string>((id$) =>
				id$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((id) =>
						identityService.deleteTenant(id).pipe(
							tap(() => {
								const filtered = store.tenants().filter((t) => t.id !== id);
								patchState(store, {
									tenants: filtered,
									tenantsTotalCount: Math.max(0, store.tenantsTotalCount() - 1),
									loading: false,
									error: null,
								});
							}),
							catchError((e) => {
								patchState(store, {
									loading: false,
									error: e?.message || 'Delete tenant failed',
								});
								return EMPTY;
							}),
						),
					),
				),
			),

			loadAllUsers: rxMethod<void>((trigger$) =>
				trigger$.pipe(
					switchMap(() =>
						// TODO: Implemenet pagination @_@
						identityService.getAllUsers(0, 100, 'updatedAt,ASC', store.currentTenant()?.id).pipe(
							tap((allUsersRes) => {
								patchState(store, {
									users: allUsersRes.content,
									usersTotalCount: allUsersRes.totalElements,
								});
							}),
							catchError(() => {
								patchState(store, { users: [], usersTotalCount: 0 });
								return EMPTY;
							}),
						),
					),
				),
			),

			searchUsers: rxMethod<{ q: string; page?: number; size?: number; sort?: string }>((params$) =>
				params$.pipe(
					switchMap(({ q, page = 0, size = 100, sort = 'updatedAt,ASC' }) =>
						identityService.searchUser(q, page, size, sort).pipe(
							tap((results) => {
								patchState(store, {
									users: results.content,
									usersTotalCount: results?.totalElements ?? 0,
								});
							}),
							catchError(() => {
								patchState(store, { users: [], usersTotalCount: 0 });
								return EMPTY;
							}),
						),
					),
				),
			),

			createUser: rxMethod<Partial<UserCreateRequest>>((payload$) =>
				payload$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((payload) =>
						identityService.createUser(payload).pipe(
							tap((user) => {
								const updated = [...store.users(), user];
								patchState(store, {
									users: updated,
									usersTotalCount: store.usersTotalCount() + 1,
									loading: false,
									error: null,
								});
							}),
							catchError((e) => {
								patchState(store, { loading: false, error: e?.message || 'Create user failed' });
								return EMPTY;
							}),
						),
					),
				),
			),

			updateUser: rxMethod<{
				id: string;
				changes: Partial<UserUpdateRequest>;
			}>((payload$) =>
				payload$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap(({ id, changes }) =>
						identityService.updateUser(id, changes).pipe(
							tap((updatedUser) => {
								const list = store.users();
								const idx = list.findIndex((u) => u.id === id);
								if (idx >= 0) {
									const next = [...list];
									next[idx] = updatedUser;
									patchState(store, { users: next, loading: false, error: null });
								} else {
									patchState(store, { loading: false, error: null });
								}
							}),
							catchError((e) => {
								patchState(store, { loading: false, error: e?.message || 'Update user failed' });
								return EMPTY;
							}),
						),
					),
				),
			),

			deleteUser: rxMethod<string>((id$) =>
				id$.pipe(
					tap(() => patchState(store, { loading: true, error: null })),
					switchMap((id) =>
						identityService.deleteUser(id).pipe(
							tap(() => {
								const filtered = store.users().filter((u) => u.id !== id);
								patchState(store, {
									users: filtered,
									usersTotalCount: Math.max(0, store.usersTotalCount() - 1),
									loading: false,
									error: null,
								});
							}),
							catchError((e) => {
								patchState(store, { loading: false, error: e?.message || 'Delete user failed' });
								return EMPTY;
							}),
						),
					),
				),
			),
		};
	}),

	withHooks({
		onInit(store) {
			// Rehydrate
			const rawState = localStorage.getItem(STORE_FEATURE.IDENTITY);
			if (rawState) {
				const saved = JSON.parse(rawState) as Partial<IdentityState>;
				patchState(store, { ...initialIdentityState, ...saved, loading: false, error: null });
			}

			// Initialize current tenant when authenticated
			effect(() => {
				const authenticated = store.isAuthenticated?.();
				if (authenticated) {
					store.resolveCurrentTenant();
				} else {
					patchState(store, { currentTenant: null });
				}
			});

			// On store change, persist in localstorage for re-hydration (exclude currentTenant)
			effect(() => {
				const snapshot = {
					username: store.username?.(),
					name: store.name?.(),
					surname: store.surname?.(),
					isAuthenticated: store.isAuthenticated?.(),
					roles: store.roles?.(),
					accessToken: store.accessToken?.(),
					refreshToken: store.refreshToken?.(),
					tokenType: store.tokenType?.(),
				} as Partial<IdentityState>;
				localStorage.setItem(STORE_FEATURE.IDENTITY, JSON.stringify(snapshot));
			});
		},
	}),
);
