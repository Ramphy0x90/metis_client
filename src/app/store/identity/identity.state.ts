import { AuthenticationResponse } from '../../types/identity/authentication-response';

export interface IdentityState {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	tokenType: string | null;
	error: string | null;
	loading: boolean;
}

export const initialIdentityState: IdentityState = {
	isAuthenticated: false,
	accessToken: null,
	refreshToken: null,
	tokenType: null,
	error: null,
	loading: false,
};
