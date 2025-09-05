import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { identityReducer } from './store/identity';
import { provideEffects } from '@ngrx/effects';
import { IdentityEffects } from './store/identity/identity.effects';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideStore({ identity: identityReducer }),
		provideEffects([IdentityEffects]),
		provideHttpClient(),
	],
};
