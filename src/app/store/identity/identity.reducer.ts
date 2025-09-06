import { createReducer, on } from '@ngrx/store';
import { IdentityState, initialIdentityState } from './identity.state';
import { IdentityActions } from './identity.actions';

export const identityReducer = createReducer(
	initialIdentityState,
	on(IdentityActions.login, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(IdentityActions.loginSuccess, (state, { authResponse }) => ({
		...state,
		username: authResponse.username,
		name: authResponse.name,
		surname: authResponse.surname,
		isAuthenticated: true,
		accessToken: authResponse.accessToken,
		refreshToken: authResponse.refreshToken,
		tokenType: authResponse.tokenType,
		error: null,
		loading: false,
	})),

	on(IdentityActions.loginFailure, (state, { error }) => ({
		...state,
		username: null,
		name: null,
		surname: null,
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		tokenType: null,
		error,
		loading: false,
	})),

	on(IdentityActions.logout, (state) => ({
		...state,
		username: null,
		name: null,
		surname: null,
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		tokenType: null,
		error: null,
		loading: false,
	})),

	on(IdentityActions.refreshToken, (state) => ({
		...state,
		loading: true,
		error: null,
	})),

	on(IdentityActions.refreshTokenSuccess, (state, { authResponse }) => ({
		...state,
		isAuthenticated: true,
		accessToken: authResponse.accessToken,
		refreshToken: authResponse.refreshToken,
		tokenType: authResponse.tokenType,
		error: null,
		loading: false,
	})),

	on(IdentityActions.refreshTokenFailure, (state) => ({
		...state,
		username: null,
		name: null,
		surname: null,
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		tokenType: null,
		error: 'Token refresh failed',
		loading: false,
	})),
);
