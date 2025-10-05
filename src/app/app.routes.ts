import { Routes } from '@angular/router';
import { NavBarItem } from './types/nav-bar-item';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { TenantsPage } from './pages/tenants-page/tenants-page';
import { UsersPage } from './pages/users-page/users-page';
import { AuthenticationPage } from './pages/authentication-page/authentication-page';
import { AuthGuard } from './guards/auth.guard';
import { HomePage } from './pages/home-page/home-page';
import { Role } from './types/identity/roles';

export const enum ROUTES {
	AUTH = 'auth',
	HOME = '',
	DASHBOARD = 'admin/dashboard',
	TENANTS = 'admin/tenants',
	USERS = 'admin/users',
}

export const NAV_BAR_ROUTES: readonly NavBarItem[] = [
	{
		label: 'Dashboard',
		path: ROUTES.DASHBOARD,
		icon: 'bi-house',
		visibility: [Role.GLOBAL_ADMIN, Role.ADMIN, Role.EMPLOYEE],
	},
	{ label: 'Tenants', path: ROUTES.TENANTS, icon: 'bi-building', visibility: [Role.GLOBAL_ADMIN] },
	{
		label: 'Users',
		path: ROUTES.USERS,
		icon: 'bi-people',
		visibility: [Role.GLOBAL_ADMIN, Role.ADMIN],
	},
];

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: ROUTES.HOME },
	{ path: ROUTES.HOME, component: HomePage },
	{ path: ROUTES.AUTH, component: AuthenticationPage },
	{ path: ROUTES.DASHBOARD, component: DashboardPage, canActivate: [AuthGuard] },
	{ path: ROUTES.TENANTS, component: TenantsPage, canActivate: [AuthGuard] },
	{ path: ROUTES.USERS, component: UsersPage, canActivate: [AuthGuard] },
];
