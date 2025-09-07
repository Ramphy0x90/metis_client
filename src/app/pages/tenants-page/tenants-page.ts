import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';

@Component({
	selector: 'app-tenants-page',
	imports: [CommonModule, DCardComponent],
	templateUrl: './tenants-page.html',
	styleUrl: './tenants-page.scss',
})
export class TenantsPage {}
