import { TenantResponse } from '../../types/tenant/tenant-response';

export interface IdentityState {
	username: string | null;
	name: string | null;
	surname: string | null;
	isAuthenticated: boolean;
	roles: string[];
	accessToken: string | null;
	refreshToken: string | null;
	tokenType: string | null;
	error: string | null;
	loading: boolean;
	tenants: TenantResponse[];
	tenantsTotalCount: number;
}

export const initialIdentityState: IdentityState = {
	username: null,
	name: null,
	surname: null,
	isAuthenticated: false,
	roles: [],
	accessToken: null,
	refreshToken: null,
	tokenType: null,
	error: null,
	loading: false,
	tenants: [],
	tenantsTotalCount: 0,
};
