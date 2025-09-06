import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IdentityState } from './identity.state';

export const selectIdentityState = createFeatureSelector<IdentityState>('identity');

export const selectIsAuthenticated = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.isAuthenticated,
);

export const selectUsername = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.username,
);

export const selectUserLabel = createSelector(
	selectIdentityState,
	(state: IdentityState) => `${state.name} ${state.surname}`,
);

export const selectAccessToken = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.accessToken,
);

export const selectRefreshToken = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.refreshToken,
);

export const selectTokenType = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.tokenType,
);

export const selectAuthError = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.error,
);

export const selectAuthLoading = createSelector(
	selectIdentityState,
	(state: IdentityState) => state.loading,
);

export const selectAuthHeaders = createSelector(
	selectAccessToken,
	selectTokenType,
	(accessToken, tokenType) => {
		if (accessToken && tokenType) {
			return {
				Authorization: `${tokenType} ${accessToken}`,
			};
		}
		return {};
	},
);
