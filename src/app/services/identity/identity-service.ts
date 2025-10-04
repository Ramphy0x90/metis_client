import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../../types/identity/authentication-response';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { environment } from '../../../environments/environment';
import { TenantResponse } from '../../types/tenant/tenant-response';
import { DbPage } from '../../types/db-page';
import { UserResponse } from '../../types/user/user-response';
import { UserCreateRequest } from '../../types/user/user-create-request';
import { UserUpdateRequest } from '../../types/user/user-update-request';

@Injectable({
	providedIn: 'root',
})
export class IdentityService {
	readonly API_BASE_AUTH: string = `${environment.apiUrl}/auth`;
	readonly API_BASE_TENANT: string = `${environment.apiUrl}/tenants`;
	readonly API_BASE_USER: string = `${environment.apiUrl}/users`;

	constructor(private httpClient: HttpClient) {}

	public login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
		return this.httpClient.post<AuthenticationResponse>(`${this.API_BASE_AUTH}/login`, credentials);
	}

	public refreshToken(refreshToken: string): Observable<AuthenticationResponse> {
		return this.httpClient.post<AuthenticationResponse>(`${this.API_BASE_AUTH}/refresh`, {
			refreshToken,
		});
	}

	public getAllTenants(
		page: number,
		size: number,
		sort?: string,
	): Observable<DbPage<TenantResponse>> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<DbPage<TenantResponse>>(`${this.API_BASE_TENANT}`, { params });
	}

	public searchTenant(
		q: string,
		page: number,
		size: number,
		sort?: string,
	): Observable<DbPage<TenantResponse>> {
		let params = new HttpParams().set('q', q).set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<DbPage<TenantResponse>>(`${this.API_BASE_TENANT}/search`, {
			params,
		});
	}

	public createTenant(payload: Partial<TenantResponse>): Observable<TenantResponse> {
		return this.httpClient.post<TenantResponse>(`${this.API_BASE_TENANT}`, payload);
	}

	public updateTenant(id: string, payload: Partial<TenantResponse>): Observable<TenantResponse> {
		return this.httpClient.put<TenantResponse>(`${this.API_BASE_TENANT}/${id}`, payload);
	}

	public deleteTenant(id: string): Observable<void> {
		return this.httpClient.delete<void>(`${this.API_BASE_TENANT}/${id}`);
	}

	public getAllUsers(page: number, size: number, sort?: string): Observable<DbPage<UserResponse>> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<DbPage<UserResponse>>(`${this.API_BASE_USER}`, { params });
	}

	public getAllUsersByTenantId(tenantId: string): Observable<DbPage<UserResponse>> {
		return this.httpClient.get<DbPage<UserResponse>>(`${this.API_BASE_USER}/${tenantId}`);
	}

	public searchUser(
		q: string,
		page: number,
		size: number,
		sort?: string,
	): Observable<DbPage<UserResponse>> {
		let params = new HttpParams().set('q', q).set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<DbPage<UserResponse>>(`${this.API_BASE_USER}/search`, {
			params,
		});
	}

	public createUser(payload: Partial<UserCreateRequest>): Observable<UserResponse> {
		return this.httpClient.post<UserResponse>(`${this.API_BASE_USER}`, payload);
	}

	public updateUser(id: string, payload: Partial<UserUpdateRequest>): Observable<UserResponse> {
		return this.httpClient.put<UserResponse>(`${this.API_BASE_USER}/${id}`, payload);
	}

	public deleteUser(id: string): Observable<void> {
		return this.httpClient.delete<void>(`${this.API_BASE_USER}/${id}`);
	}

	public getUserRoles(): Observable<string[]> {
		return this.httpClient.get<string[]>(`${this.API_BASE_USER}/roles`);
	}
}
