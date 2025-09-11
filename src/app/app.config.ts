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
import { IdentityStore } from './store/identity/identity.store';
import { NavigationStore } from './store/navigation/navigation.store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withHashLocation()),
		provideStore(),
		IdentityStore,
		NavigationStore,
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideHttpClient(),
	],
};
