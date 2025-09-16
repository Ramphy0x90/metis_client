import { CommonModule } from '@angular/common';
import { Component, Input, signal, Signal, HostListener } from '@angular/core';
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

	entityActionsVisibleForId: unknown | null = null;

	getEntityFieldValue(entity: T, field: string): unknown {
		return (entity as Record<string, unknown>)?.[field] ?? '';
	}

	toggleEntityActions(event: MouseEvent, entityId: unknown): void {
		event.stopPropagation();
		this.entityActionsVisibleForId = this.entityActionsVisibleForId === entityId ? null : entityId;
	}

	isEntityActionsVisible(entityId: unknown): boolean {
		return this.entityActionsVisibleForId === entityId;
	}

	@HostListener('document:click')
	closeActionsOnOutsideClick(): void {
		if (this.entityActionsVisibleForId !== null) {
			this.entityActionsVisibleForId = null;
		}
	}
}
