import {
	signalStore,
	withMethods,
	withState,
	patchState,
	withComputed,
	withHooks,
} from '@ngrx/signals';
import { initialNavigationState, NavigationState } from './navigation.state';
import { computed, effect } from '@angular/core';
import { STORE_FEATURE } from '../features';

export const NavigationStore = signalStore(
	withState<NavigationState>(initialNavigationState),

	withComputed(({ isOpen }) => ({
		isOpen: computed(() => isOpen()),
	})),

	withMethods((store) => {
		return {
			open: () => patchState(store, { isOpen: true }),
			close: () => patchState(store, { isOpen: false }),
			toggle: () => patchState(store, (state) => ({ isOpen: !state.isOpen })),
		};
	}),

	withHooks({
		onInit(store) {
			// Rehydrate
			const rawState = localStorage.getItem(STORE_FEATURE.NAVIGATION);
			if (rawState) {
				const saved = JSON.parse(rawState) as Partial<NavigationState>;
				patchState(store, { ...initialNavigationState, ...saved });
			}

			// On store change, persiste in localstorage for re-hydration
			effect(() => {
				const snapshot = { isOpen: store.isOpen() } as Partial<NavigationState>;
				localStorage.setItem(STORE_FEATURE.NAVIGATION, JSON.stringify(snapshot));
			});
		},
	}),
);
