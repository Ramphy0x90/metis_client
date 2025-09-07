import { Component, ElementRef, HostListener } from '@angular/core';
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
	constructor(
		private store: Store,
		private elementRef: ElementRef,
	) {}

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

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: Event): void {
		if (this.areOptionsVisible) {
			const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);

			if (!clickedInside) {
				this.areOptionsVisible = false;
			}
		}
	}

	toggleOptionsVisibility(): void {
		this.areOptionsVisible = !this.areOptionsVisible;
	}

	logout(): void {
		this.store.dispatch(IdentityActions.logout());
	}
}
