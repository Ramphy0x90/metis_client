export type UserCreateRequest = {
	email: string;
	password: string;
	name: string;
	surname: string;
	tenantId: string;
	roles: string[];
};
