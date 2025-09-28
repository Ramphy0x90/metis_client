import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';
import { IdentityStore } from '../../store/identity';
import { LogsViewer } from '../../components/logs-viewer/logs-viewer';

@Component({
	selector: 'app-dashboard-page',
	imports: [CommonModule, DCardComponent, LogsViewer, LogsViewer],
	templateUrl: './dashboard-page.html',
	styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);

	tenantsCount: Signal<number>;
	usersCount: Signal<number>;

	constructor() {
		this.tenantsCount = this.identityStore.tenantsTotalCount;
		this.usersCount = this.identityStore.usersTotalCount;
	}
}
