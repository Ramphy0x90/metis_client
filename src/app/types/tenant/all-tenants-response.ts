import { TenantResponse } from './tenant-response';

export type AllTenantsResponse = {
	tenants: TenantResponse[];
	totalCount: number;
};
