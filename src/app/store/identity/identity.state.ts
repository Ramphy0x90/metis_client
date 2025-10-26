import { TenantResponse } from '../../types/identity/tenant/tenant-response';
import { UserResponse } from '../../types/identity/user/user-response';

export interface IdentityState {
	username: string | null;
	name: string | null;
	surname: string | null;
	isAuthenticated: boolean;
	roles: string[];
	availableRoles: string[];
	accessToken: string | null;
	refreshToken: string | null;
	tokenType: string | null;
	currentTenant: TenantResponse | null;
	error: string | null;
	loading: boolean;
	tenants: TenantResponse[];
	tenantsTotalCount: number;
	users: UserResponse[];
	usersTotalCount: number;
}

export const initialIdentityState: IdentityState = {
	username: null,
	name: null,
	surname: null,
	isAuthenticated: false,
	roles: [],
	availableRoles: [],
	accessToken: null,
	refreshToken: null,
	tokenType: null,
	currentTenant: null,
	error: null,
	loading: false,
	tenants: [],
	tenantsTotalCount: 0,
	users: [],
	usersTotalCount: 0,
};
