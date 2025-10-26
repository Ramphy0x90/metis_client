import { Component, Injector, OnInit, Signal, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation-component/navigation-component';
import { IdentityStore } from './store/identity/identity.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header-component/header-component';
import { Role } from './types/identity/roles';
import { TenantResponse } from './types/identity/tenant/tenant-response';
import { filter, Subscription } from 'rxjs';

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
	private router: Router = inject(Router);

	readonly currentTenant: Signal<TenantResponse | null> = this.identityStore.currentTenant;
	readonly isUserAuthenticated: Signal<boolean> = this.identityStore.isAuthenticated;
	readonly userRole: Signal<string>;

	routerSub: Subscription;
	isHomeRoute: boolean = false;

	constructor() {
		this.userRole = this.identityStore.userMainRole;

		this.routerSub = this.router.events
			.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
			.subscribe((e) => {
				const url = e.urlAfterRedirects.replace(/^#?\//, '');
				this.isHomeRoute = url === '' || url === '/';
			});
	}

	ngOnInit(): void {
		effect(
			() => {
				if (this.isUserAuthenticated()) {
					switch (this.identityStore.userMainRole()) {
						case Role.GLOBAL_ADMIN:
							this.identityStore.loadAllTenants();
							this.identityStore.loadAllUsers();
							break;
						case Role.ADMIN:
							this.identityStore.loadAllUsers();
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
