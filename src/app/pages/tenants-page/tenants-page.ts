import { CommonModule } from '@angular/common';
import { Component, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';
import { EntityTableComponent } from '../../components/entity-table-component/entity-table-component';
import { IdentityStore } from '../../store/identity';
import { Role } from '../../types/identity/roles';
import { watchState } from '@ngrx/signals';
import { TenantResponse } from '../../types/tenant/tenant-response';
import { Column } from '../../types/entity-table/column';

@Component({
	selector: 'app-tenants-page',
	imports: [CommonModule, DCardComponent, EntityTableComponent],
	templateUrl: './tenants-page.html',
	styleUrl: './tenants-page.scss',
})
export class TenantsPage {
	readonly TENANTS_TABLE_COLUMNS: Column[] = [
		{ key: 'name', label: 'Title', size: 'auto' },
		{ key: 'domain', label: 'Domain', size: 'md' },
		{ key: 'employees', label: 'Employees', size: 'sm' },
		{ key: 'activeBookings', label: 'Active Bookings', size: 'sm' },
	] as const;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	tenants: Signal<TenantResponse[]>;
	tenantsCount: Signal<number>;

	constructor() {
		this.tenants = this.identityStore.tenants;
		this.tenantsCount = this.identityStore.tenantsTotalCount;
	}
}
