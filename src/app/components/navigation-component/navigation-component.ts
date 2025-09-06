import { Component } from '@angular/core';
import { NAV_BAR_ROUTES } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'navigation-component',
	imports: [CommonModule, RouterModule],
	templateUrl: './navigation-component.html',
	styleUrl: './navigation-component.scss',
	standalone: true,
})
export class NavigationComponent {
	readonly NAV_BAR_ROUTES = NAV_BAR_ROUTES;

	isNavCollapsed: boolean = false;
	isNavHorizontal: boolean = false;

	toggleNav(): void {
		this.isNavCollapsed = !this.isNavCollapsed;
	}
}
