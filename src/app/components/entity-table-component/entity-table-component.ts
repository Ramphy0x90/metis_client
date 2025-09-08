import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InputWrapperComponent } from '../input-wrapper-component/input-wrapper-component';

@Component({
	selector: 'entity-table-component',
	imports: [CommonModule, InputWrapperComponent],
	templateUrl: './entity-table-component.html',
	styleUrl: './entity-table-component.scss',
	standalone: true,
})
export class EntityTableComponent<T> {
	@Input() tableTitle: string = '';

	// Data label by data key
	@Input() columns: Record<string, string> = {};
	@Input() data: T[] = [];

	get dataKeys(): string[] {
		return Object.keys(this.columns);
	}
}
