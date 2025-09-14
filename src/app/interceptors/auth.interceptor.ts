import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IdentityStore } from '../store/identity/identity.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const identityStore: any = inject(IdentityStore);
	const headers: Record<string, string> = identityStore?.authHeaders?.() ?? {};

	const hasAuth = Boolean(headers['Authorization']);
	const authReq = hasAuth ? req.clone({ setHeaders: headers }) : req;

	return next(authReq);
};
