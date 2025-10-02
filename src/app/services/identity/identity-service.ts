import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../../types/identity/authentication-response';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { environment } from '../../../environments/environment';
import { AllTenantsResponse } from '../../types/tenant/all-tenants-response';
import { AllUsersResponse } from '../../types/user/all-users-response';
import { TenantResponse } from '../../types/tenant/tenant-response';

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

	public getAllTenants(page: number, size: number, sort?: string): Observable<AllTenantsResponse> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<AllTenantsResponse>(`${this.API_BASE_TENANT}`, { params });
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

	public getAllUsers(page: number, size: number, sort?: string): Observable<AllUsersResponse> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<AllUsersResponse>(`${this.API_BASE_USER}`, { params });
	}

	public getAllUsersByTenantId(tenantId: string): Observable<AllTenantsResponse> {
		return this.httpClient.get<AllTenantsResponse>(`${this.API_BASE_USER}/${tenantId}`);
	}
}
