import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	signal,
	Signal,
	HostListener,
	Output,
	EventEmitter,
	computed,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputWrapperComponent } from '../input-wrapper-component/input-wrapper-component';
import { EntityField, EntityFieldVisiblity } from '../../types/entity/field';
import { DbEntity } from '../../types/db-entity';

@Component({
	selector: 'entity-table-component',
	imports: [CommonModule, InputWrapperComponent, ReactiveFormsModule],
	templateUrl: './entity-table-component.html',
	styleUrl: './entity-table-component.scss',
	standalone: true,
})
export class EntityTableComponent<T extends DbEntity & Record<string, unknown>> {
	readonly EntityFieldVisiblity = EntityFieldVisiblity;

	@Input() tableTitle: string = '';

	// Data label by data key
	@Input() fields: EntityField[] = [];
	@Input() data!: Signal<T[]>;
	@Input() lookupData?: Signal<Record<string, unknown>>;

	@Output() viewEntity = new EventEmitter<T>();
	@Output() editEntity = new EventEmitter<T>();
	@Output() deleteEntity = new EventEmitter<T>();
	@Output() search = new EventEmitter<string>();

	searchControl = new FormControl<string>('');

	constructor() {
		this.searchControl.valueChanges
			.pipe(debounceTime(150), distinctUntilChanged())
			.subscribe((value) => this.search.emit((value ?? '').trim()));
	}

	entityActionsVisibleForId: unknown | null = null;

	isFieldVisible(visibility: EntityFieldVisiblity): boolean {
		return [EntityFieldVisiblity.TABLE, EntityFieldVisiblity.ALL].includes(visibility);
	}

	getEntityFieldValue(entity: T, field: string): unknown {
		return (entity as Record<string, unknown>)?.[field] ?? '';
	}

	getEntityFieldValueByField(entity: T, field: EntityField): unknown {
		if (field.lookupDataID && this.lookupData) {
			const dataKey = ((entity as Record<string, unknown>)?.[field.key] ?? '') as string;
			const data = computed(() => this.lookupData?.()[dataKey]);
			return (data?.() as Record<string, unknown>)?.[field.lookupDataID];
		}

		return (entity as Record<string, unknown>)?.[field.key] ?? '';
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

	onView(entity: T): void {
		this.viewEntity.emit(entity);
	}

	onEdit(entity: T): void {
		this.editEntity.emit(entity);
	}

	onDelete(entity: T): void {
		this.deleteEntity.emit(entity);
	}
}
