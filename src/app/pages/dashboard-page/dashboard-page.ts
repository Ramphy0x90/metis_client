import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';

@Component({
	selector: 'app-dashboard-page',
	imports: [CommonModule, DCardComponent],
	templateUrl: './dashboard-page.html',
	styleUrl: './dashboard-page.scss',
})
export class DashboardPage {}
