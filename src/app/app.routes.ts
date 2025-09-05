import { Routes } from '@angular/router';
import { NavBarItem } from './types/nav-bar-item';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { TenantsPage } from './pages/tenants-page/tenants-page';
import { UsersPage } from './pages/users-page/users-page';
import { AuthenticationPage } from './pages/authentication-page/authentication-page';
import { AuthGuard } from './guards/auth.guard';

export const enum ROUTES {
	DASHBOARD = 'dashboard',
	TENANTS = 'tenants',
	USERS = 'users',
}

export const NAV_BAR_ROUTES: readonly NavBarItem[] = [
	{ label: 'Dashboard', path: ROUTES.DASHBOARD },
	{ label: 'Tenants', path: ROUTES.TENANTS },
	{ label: 'Users', path: ROUTES.USERS },
];

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{ path: 'auth', component: AuthenticationPage },
	{ path: ROUTES.DASHBOARD, component: DashboardPage, canActivate: [AuthGuard] },
	{ path: ROUTES.TENANTS, component: TenantsPage, canActivate: [AuthGuard] },
	{ path: ROUTES.USERS, component: UsersPage, canActivate: [AuthGuard] },
];
