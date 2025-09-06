import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NavigationState } from './navigation.state';

export const selectNavigationFeature = createFeatureSelector<NavigationState>('navigation');

export const selectIsNavigationOpen = createSelector(
	selectNavigationFeature,
	(state: NavigationState) => state.isOpen
);

export const selectNavigationState = createSelector(
	selectNavigationFeature,
	(state: NavigationState) => state
);
