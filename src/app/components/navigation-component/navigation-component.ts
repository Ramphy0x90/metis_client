import { Component, Signal, inject } from '@angular/core';
import { NAV_BAR_ROUTES } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationStore } from '../../store/navigation/navigation.store';

@Component({
	selector: 'navigation-component',
	imports: [CommonModule, RouterModule],
	templateUrl: './navigation-component.html',
	styleUrl: './navigation-component.scss',
	standalone: true,
})
export class NavigationComponent {
	readonly NAV_BAR_ROUTES = NAV_BAR_ROUTES;
	private navigationStore: InstanceType<typeof NavigationStore> = inject(NavigationStore);

	isNavOpen: Signal<boolean>;

	constructor() {
		this.isNavOpen = this.navigationStore.isOpen;
	}

	toggleNav(): void {
		this.navigationStore.toggle();
	}
}
