import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
	IdentityActions,
	selectIsAuthenticated,
	selectUserLabel,
	selectUsername,
} from '../../store/identity';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'user-profile-btn-component',
	imports: [CommonModule],
	templateUrl: './user-profile-btn-component.html',
	styleUrl: './user-profile-btn-component.scss',
	standalone: true,
})
export class UserProfileBtnComponent {
	constructor(private store: Store) {}

	areOptionsVisible: boolean = false;

	get username(): Observable<string | null> {
		return this.store.select(selectUsername);
	}

	get userLabel(): Observable<string | null> {
		return this.store.select(selectUserLabel);
	}

	get isUserAuthenticated(): Observable<boolean> {
		return this.store.select(selectIsAuthenticated);
	}

	toggleOptionsVisibility(): void {
		this.areOptionsVisible = !this.areOptionsVisible;
	}

	logout(): void {
		this.store.dispatch(IdentityActions.logout());
	}
}
