import { Component, inject } from '@angular/core';
import { InputWrapperComponent } from '../../components/input-wrapper-component/input-wrapper-component';
import { CommonModule } from '@angular/common';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { FormsModule } from '@angular/forms';
import { IdentityStore } from '../../store/identity/identity.store';

@Component({
	selector: 'app-authentication-page',
	imports: [CommonModule, FormsModule, InputWrapperComponent],
	templateUrl: './authentication-page.html',
	styleUrl: './authentication-page.scss',
	standalone: true,
})
export class AuthenticationPage {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);

	authCredentials: AuthenticationRequest = {
		email: '',
		password: '',
	};

	login(): void {
		this.identityStore.login(this.authCredentials);
	}
}
