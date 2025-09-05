import { Component } from '@angular/core';
import { InputWrapperComponent } from '../../components/input-wrapper-component/input-wrapper-component';
import { CommonModule } from '@angular/common';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IdentityActions } from '../../store/identity';

@Component({
	selector: 'app-authentication-page',
	imports: [CommonModule, FormsModule, InputWrapperComponent],
	templateUrl: './authentication-page.html',
	styleUrl: './authentication-page.scss',
	standalone: true,
})
export class AuthenticationPage {
	authCredentials: AuthenticationRequest = {
		email: '',
		password: '',
	};

	constructor(private store: Store) {}

	login(): void {
		this.store.dispatch(IdentityActions.login({ credentials: this.authCredentials }));
	}
}
