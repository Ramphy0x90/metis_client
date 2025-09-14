import { Component, Injector, OnInit, Signal, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation-component/navigation-component';
import { IdentityStore } from './store/identity/identity.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header-component/header-component';
import { Role } from './types/identity/roles';
import { watchState } from '@ngrx/signals';

@Component({
	selector: 'app-root',
	imports: [CommonModule, RouterOutlet, NavigationComponent, HeaderComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit {
	private readonly injector = inject(Injector);
	protected readonly title = signal('Metis');

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	readonly isUserAuthenticated: Signal<boolean> = this.identityStore.isAuthenticated;
	readonly userRole: Signal<string>;

	constructor() {
		this.userRole = this.identityStore.userMainRole;
	}

	ngOnInit(): void {
		effect(
			() => {
				if (this.isUserAuthenticated()) {
					switch (this.identityStore.userMainRole()) {
						case Role.GLOBAL_ADMIN:
							this.identityStore.loadAllTenants();
							break;
						default:
							break;
					}
				}
			},
			{ injector: this.injector },
		);
	}
}
