import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IdentityStore } from '../store/identity/identity.store';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);

	constructor(private router: Router) {}

	canActivate(): Observable<boolean> {
		const isAuthenticated = this.identityStore.isAuthenticated();
		if (!isAuthenticated) {
			this.router.navigate(['/auth']);
			return new Observable<boolean>((subscriber) => {
				subscriber.next(false);
				subscriber.complete();
			});
		}
		return new Observable<boolean>((subscriber) => {
			subscriber.next(true);
			subscriber.complete();
		});
	}
}
