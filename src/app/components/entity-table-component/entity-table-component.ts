import { CommonModule } from '@angular/common';
import { Component, Input, signal, Signal } from '@angular/core';
import { InputWrapperComponent } from '../input-wrapper-component/input-wrapper-component';
import { Column } from '../../types/entity-table/column';

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
	@Input() columns: Column[] = [];
	@Input() data!: Signal<T[]>;

	getEntityFieldValue(entity: T, field: string): unknown {
		return (entity as Record<string, unknown>)?.[field] ?? '';
	}
}
