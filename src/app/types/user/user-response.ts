import { DbEntity } from '../db-entity';

export type UserResponse = DbEntity & {
	email: string;
	name: string;
	surname: string;
	tenantId: string;
	roles: string[];
};
