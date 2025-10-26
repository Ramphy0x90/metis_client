export type TenantServiceCreateRequest = {
	tenantId: string;
	title: string;
	description: string;
	durationMinutes: number;
	price: number;
};
