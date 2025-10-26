import { DbEntity } from '../../db-entity';

export type TenantServiceResponse = DbEntity & {
	tenantId: string;
	tenantName: string;
	title: string;
	description: string;
	durationMinutes: number;
	price: number;
};
