import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileBtnComponent } from '../user-profile-btn-component/user-profile-btn-component';

@Component({
	selector: 'header-component',
	imports: [CommonModule, UserProfileBtnComponent],
	templateUrl: './header-component.html',
	styleUrl: './header-component.scss',
	standalone: true,
})
export class HeaderComponent {}
