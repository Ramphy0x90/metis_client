export interface IdentityState {
	username: string | null;
	name: string | null;
	surname: string | null;
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	tokenType: string | null;
	error: string | null;
	loading: boolean;
}

export const initialIdentityState: IdentityState = {
	username: null,
	name: null,
	surname: null,
	isAuthenticated: false,
	accessToken: null,
	refreshToken: null,
	tokenType: null,
	error: null,
	loading: false,
};
