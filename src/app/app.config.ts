import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
	isDevMode,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { identityReducer } from './store/identity';
import { navigationReducer } from './store/navigation';
import { provideEffects } from '@ngrx/effects';
import { IdentityEffects } from './store/identity/identity.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
    withHashLocation(),
		provideStore(
			{
				identity: identityReducer,
				navigation: navigationReducer,
			},
			{
				metaReducers: [
					localStorageSync({
						keys: ['identity', 'navigation'],
						rehydrate: true,
						storage: localStorage,
					}),
				],
			},
		),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideEffects([IdentityEffects]),
		provideHttpClient(),
	],
};
