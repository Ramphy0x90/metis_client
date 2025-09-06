import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../../types/identity/authentication-response';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class IdentityService {
	readonly API_BASE_AUTH: string = `${environment.apiUrl}/auth`;

	constructor(private httpClient: HttpClient) {}

	public login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
		return this.httpClient.post<AuthenticationResponse>(`${this.API_BASE_AUTH}/login`, credentials);
	}

	public refreshToken(refreshToken: string): Observable<AuthenticationResponse> {
		return this.httpClient.post<AuthenticationResponse>(`${this.API_BASE_AUTH}/refresh`, {
			refreshToken
		});
	}
}
