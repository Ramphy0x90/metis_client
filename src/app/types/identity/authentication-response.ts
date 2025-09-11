export type AuthenticationResponse = {
	username: string;
	name: string;
	surname: string;
	roles: string[];
	accessToken: string;
	refreshToken: string;
	tokenType: string;
};
