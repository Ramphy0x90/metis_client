import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IdentityService } from '../../services/identity/identity-service';
import { IdentityActions } from '../identity/identity.actions';
import { Router } from '@angular/router';

@Injectable()
export class IdentityEffects {
	private actions$ = inject(Actions);
	private identityService = inject(IdentityService);
	private router = inject(Router);

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(IdentityActions.login),
			switchMap(({ credentials }) =>
				this.identityService.login(credentials).pipe(
					map((authResponse) => IdentityActions.loginSuccess({ authResponse })),
					catchError((error) =>
						of(IdentityActions.loginFailure({ error: error.message || 'Login failed' })),
					),
				),
			),
		),
	);

	loginSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(IdentityActions.loginSuccess),
				tap(() => {
					this.router.navigate(['/dashboard']);
				}),
			),
		{ dispatch: false },
	);
}
