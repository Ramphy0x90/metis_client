import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthenticationResponse } from '../../types/identity/authentication-response';
import { AuthenticationRequest } from '../../types/identity/authentication-request';

export const IdentityActions = createActionGroup({
	source: 'Identity',
	events: {
		Login: props<{ credentials: AuthenticationRequest }>(),
		'Login Success': props<{ authResponse: AuthenticationResponse }>(),
		'Login Failure': props<{ error: string }>(),
		Logout: emptyProps(),
		'Refresh Token': props<{ refreshToken: string }>(),
		'Refresh Token Success': props<{ authResponse: AuthenticationResponse }>(),
		'Refresh Token Failure': emptyProps(),
	},
});
