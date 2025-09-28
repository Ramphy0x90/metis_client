import { DbEntity } from '../db-entity';

export type TenantResponse = DbEntity & {
	name: string;
	domain: string;
	employeeCount: number;
	customerCount: number;
};
