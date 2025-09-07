import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'd-card-component',
	imports: [CommonModule],
	templateUrl: './d-card-component.html',
	styleUrl: './d-card-component.scss',
	standalone: true,
})
export class DCardComponent {
	@Input() title: string = '';
	@Input() icon: string = '';
	@Input() inpactValue: string = '';
}
