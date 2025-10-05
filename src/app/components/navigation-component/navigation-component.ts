import { Component, Signal, inject } from '@angular/core';
import { NAV_BAR_ROUTES } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationStore } from '../../store/navigation/navigation.store';
import { NavBarItem } from '../../types/nav-bar-item';
import { IdentityStore } from '../../store/identity';
import { Role } from '../../types/identity/roles';

@Component({
	selector: 'navigation-component',
	imports: [CommonModule, RouterModule],
	templateUrl: './navigation-component.html',
	styleUrl: './navigation-component.scss',
	standalone: true,
})
export class NavigationComponent {
	readonly NAV_BAR_ROUTES = NAV_BAR_ROUTES;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	private navigationStore: InstanceType<typeof NavigationStore> = inject(NavigationStore);

	visibleNavRoutes: NavBarItem[] = [];

	readonly userRole: Signal<string>;
	readonly isNavOpen: Signal<boolean>;

	constructor() {
		this.userRole = this.identityStore.userMainRole;
		this.isNavOpen = this.navigationStore.isOpen;

		this.visibleNavRoutes = this.NAV_BAR_ROUTES.filter((r) =>
			r.visibility.includes(this.userRole() as Role),
		);
	}

	toggleNav(): void {
		this.navigationStore.toggle();
	}
}
