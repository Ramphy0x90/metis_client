import { UserResponse } from './user-response';

export type AllUsersResponse = {
	tenants: UserResponse[];
	totalCount: number;
};
