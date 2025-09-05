import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'input-wrapper',
	imports: [CommonModule],
	templateUrl: './input-wrapper-component.html',
	styleUrl: './input-wrapper-component.scss',
	standalone: true,
})
export class InputWrapperComponent {
	@Input() prefix?: string;
	@Input() prefixIcon?: string;
	@Input() suffix?: string;
	@Input() suffixIcon?: string;
}
