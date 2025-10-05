import { Component, inject, Signal } from '@angular/core';
import { IdentityStore } from '../../store/identity';

@Component({
	selector: 'app-home-page',
	imports: [],
	templateUrl: './home-page.html',
	styleUrl: './home-page.scss',
})
export class HomePage {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly currentTenant: Signal<string | null> = this.identityStore.currentTenant;
}
