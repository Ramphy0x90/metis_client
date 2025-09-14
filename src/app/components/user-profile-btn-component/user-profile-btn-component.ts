import { Component, ElementRef, HostListener, Signal, inject } from '@angular/core';
import { IdentityStore } from '../../store/identity/identity.store';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';

@Component({
	selector: 'user-profile-btn-component',
	imports: [CommonModule],
	templateUrl: './user-profile-btn-component.html',
	styleUrl: './user-profile-btn-component.scss',
	standalone: true,
})
export class UserProfileBtnComponent {
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);

	areOptionsVisible: boolean = false;

	username: Signal<string | null>;
	userLabel: Signal<string | null>;
	isUserAuthenticated: Signal<boolean>;
	mainRole: Signal<string>;

	constructor(private elementRef: ElementRef) {
		this.username = this.identityStore.username;
		this.userLabel = this.identityStore.userLabel;
		this.isUserAuthenticated = this.identityStore.isAuthenticated;
		this.mainRole = this.identityStore.userMainRole;
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
		this.identityStore.logout();
	}
}
