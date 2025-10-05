import { Component, inject, OnInit } from '@angular/core';
import { InputWrapperComponent } from '../../components/input-wrapper-component/input-wrapper-component';
import { CommonModule } from '@angular/common';
import { AuthenticationRequest } from '../../types/identity/authentication-request';
import { FormsModule } from '@angular/forms';
import { IdentityStore } from '../../store/identity/identity.store';
import { Router } from '@angular/router';
import { ROUTES } from '../../app.routes';
import { TenantAwarenessService } from '../../services/tenant-awareness/tenant-awareness';

@Component({
	selector: 'app-authentication-page',
	imports: [CommonModule, FormsModule, InputWrapperComponent],
	templateUrl: './authentication-page.html',
	styleUrl: './authentication-page.scss',
	standalone: true,
})
export class AuthenticationPage implements OnInit {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	private tenantAwareness: TenantAwarenessService = inject(TenantAwarenessService);
	private router: Router = inject(Router);

	authCredentials: AuthenticationRequest = {
		email: '',
		password: '',
		tenantDomain: '',
	};

	ngOnInit(): void {
		if (this.identityStore.isAuthenticated()) {
			this.router.navigate([ROUTES.DASHBOARD]);
		}
	}

	login(): void {
		this.authCredentials.tenantDomain = this.tenantAwareness.getTenant() ?? '';
		this.identityStore.login(this.authCredentials);
	}
}
