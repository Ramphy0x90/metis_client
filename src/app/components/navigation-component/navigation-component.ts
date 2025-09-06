import { Component } from '@angular/core';
import { NAV_BAR_ROUTES } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavigationActions } from '../../store/navigation/navigation.actions';
import { selectIsNavigationOpen } from '../../store/navigation/navigation.selectors';

@Component({
	selector: 'navigation-component',
	imports: [CommonModule, RouterModule],
	templateUrl: './navigation-component.html',
	styleUrl: './navigation-component.scss',
	standalone: true,
})
export class NavigationComponent {
	readonly NAV_BAR_ROUTES = NAV_BAR_ROUTES;

	isNavOpen$: Observable<boolean>;

	constructor(private store: Store) {
		this.isNavOpen$ = this.store.select(selectIsNavigationOpen);
	}

	toggleNav(): void {
		this.store.dispatch(NavigationActions.toggleNavigation());
	}
}
