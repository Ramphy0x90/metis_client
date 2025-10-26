import { Component, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/identity/tenant/tenant-response';
import { BookingService } from '../../services/booking/booking';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';
import { TenantServiceResponse } from '../../types/booking/tenant-service/tenant-service-response';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-home-page',
	imports: [AsyncPipe],
	templateUrl: './home-page.html',
	styleUrl: './home-page.scss',
})
export class HomePage implements OnDestroy {
	private destroyed$: Subject<void> = new Subject();
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly currentTenant: Signal<TenantResponse | null> = this.identityStore.currentTenant;

	constructor(private bookingService: BookingService) {
		this.tenantServices$ = this.bookingService
			.getAllTenantServices(this.currentPage, this.pageSize)
			.pipe(
				takeUntil(this.destroyed$),
				map((services) => services.content),
			);
	}

	// TODO: Put in tenant model
	priceUnit: string = 'CHF';
	currentPage: number = 0;
	pageSize: number = 10;
	tenantServices$: Observable<TenantServiceResponse[]>;

	ngOnDestroy(): void {
		this.destroyed$.next();
	}
}
