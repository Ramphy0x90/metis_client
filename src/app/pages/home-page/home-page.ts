import { Component, inject, Signal } from '@angular/core';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/tenant/tenant-response';

@Component({
	selector: 'app-home-page',
	imports: [],
	templateUrl: './home-page.html',
	styleUrl: './home-page.scss',
})
export class HomePage {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly currentTenant: Signal<TenantResponse | null> = this.identityStore.currentTenant;
}
