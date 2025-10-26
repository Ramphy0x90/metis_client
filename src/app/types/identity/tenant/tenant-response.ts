import { DbEntity } from '../../db-entity';

export type TenantResponse = DbEntity & {
	name: string;
	domain: string;
	adminCount: number;
	employeeCount: number;
	customerCount: number;
};
