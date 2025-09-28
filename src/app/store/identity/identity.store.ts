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
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, switchMap, Observable } from 'rxjs';
import { STORE_FEATURE } from '../features';

export const IdentityStore = signalStore(
	withState<IdentityState>(initialIdentityState),

    withComputed((store) => ({
		userLabel: computed(() => `${store.name?.() ?? ''} ${store.surname?.() ?? ''}`.trim()),
		// Users only have one role *_*
		userMainRole: computed(() => store.roles()[0]),
		authHeaders: computed<Record<string, string>>(() => {
			const token = store.accessToken?.();
			const type = store.tokenType?.();
			return token && type ? { Authorization: `${type} ${token}` } : ({} as Record<string, string>);
        }),
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
			router.navigate(['/dashboard']);
		});

		// Effect after logout
		const navigateToAuth = simpleEffect(() => {
			router.navigate(['/auth']);
		});

		return {
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
						identityService.getAllTenants().pipe(
							tap((allTenantsRes) => {
								patchState(store, {
									tenants: allTenantsRes.tenants,
									tenantsTotalCount: allTenantsRes.totalCount,
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

			loadAllUsers: rxMethod<void>((trigger$) =>
				trigger$.pipe(
					switchMap(() =>
						identityService.getAllUsers().pipe(
							tap((allUsersRes) => {
								patchState(store, {
									users: allUsersRes.tenants,
									usersTotalCount: allUsersRes.totalCount,
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

			// On store change, persiste in localstorage for re-hydration
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
