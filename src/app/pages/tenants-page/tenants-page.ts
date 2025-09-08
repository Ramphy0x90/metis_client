import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';
import { EntityTableComponent } from '../../components/entity-table-component/entity-table-component';

@Component({
	selector: 'app-tenants-page',
	imports: [CommonModule, DCardComponent, EntityTableComponent],
	templateUrl: './tenants-page.html',
	styleUrl: './tenants-page.scss',
})
export class TenantsPage {
	readonly TENANTS_TABLE_COLUMNS: Record<string, string> = {
		title: 'Title',
		employees: 'Employees',
		activeBookings: 'Active Bookings',
		status: 'Status',
	} as const;
}
