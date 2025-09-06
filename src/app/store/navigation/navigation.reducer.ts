import { createReducer, on } from '@ngrx/store';
import { NavigationState, initialNavigationState } from './navigation.state';
import { NavigationActions } from './navigation.actions';

export const navigationReducer = createReducer(
	initialNavigationState,
	on(NavigationActions.openNavigation, (state): NavigationState => ({
		...state,
		isOpen: true,
	})),
	on(NavigationActions.closeNavigation, (state): NavigationState => ({
		...state,
		isOpen: false,
	})),
	on(NavigationActions.toggleNavigation, (state): NavigationState => ({
		...state,
		isOpen: !state.isOpen,
	})),
	on(NavigationActions.setNavigationState, (state, { isOpen }): NavigationState => ({
		...state,
		isOpen,
	}))
);
