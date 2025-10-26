import { inject, Injectable, Injector, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TenantAwarenessService } from '../tenant-awareness/tenant-awareness';
import { TenantServiceResponse } from '../../types/booking/tenant-service/tenant-service-response';
import { DbPage } from '../../types/db-page';
import { Observable, of } from 'rxjs';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/identity/tenant/tenant-response';

@Injectable({
	providedIn: 'root',
})
export class BookingService {
	readonly API_BASE_SERVICES: string = `${environment.apiUrl}/services`;
	readonly API_BASE_BOOKINGS: string = `${environment.apiUrl}/bookings`;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly currentTenant: Signal<TenantResponse | null> = this.identityStore.currentTenant;

	constructor(private httpClient: HttpClient) {}

	public getAllTenantServices(
		page: number,
		size: number,
		sort?: string,
	): Observable<DbPage<TenantServiceResponse>> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<DbPage<TenantServiceResponse>>(
			`${this.API_BASE_SERVICES}?tennatId=${this.currentTenant()?.id}`,
			{
				params,
			},
		);
	}
}
