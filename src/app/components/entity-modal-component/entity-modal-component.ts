import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output,
	Signal,
	WritableSignal,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputWrapperComponent } from '../input-wrapper-component/input-wrapper-component';
import { EntityField, EntityFieldType, EntityFieldVisiblity } from '../../types/entity/field';
import { DbEntity } from '../../types/db-entity';

type EntityModalMode = 'create' | 'view' | 'edit';

@Component({
	selector: 'entity-modal-component',
	imports: [CommonModule, FormsModule, InputWrapperComponent],
	templateUrl: './entity-modal-component.html',
	styleUrl: './entity-modal-component.scss',
	standalone: true,
})
export class EntityModalComponent<T extends DbEntity & Record<string, unknown>> {
	readonly EntityFieldVisiblity = EntityFieldVisiblity;

	@Input() title: string = '';
	@Input() mode: EntityModalMode = 'view';
	@Input() fields: EntityField[] = [];
	@Input() value: T | null = null;
	@Input() visible: boolean = false;

	@Output() cancel = new EventEmitter<void>();
	@Output() save = new EventEmitter<T>();

	localValue: WritableSignal<T | null> = signal<T | null>(null);

	get isReadOnly(): boolean {
		return this.mode === 'view';
	}

	ngOnChanges(): void {
		// Clone value to local to avoid mutating input directly
		const cloned = this.value ? (JSON.parse(JSON.stringify(this.value)) as T) : ({} as T);
		this.localValue.set(cloned);
	}

	isFieldVisible(visibility: EntityFieldVisiblity): boolean {
		return [EntityFieldVisiblity.FORM, EntityFieldVisiblity.ALL].includes(visibility);
	}

	onOverlayClick(event: MouseEvent): void {
		if ((event.target as HTMLElement)?.classList.contains('entity-modal-container')) {
			this.cancel.emit();
		}
	}

	onSave(): void {
		const current = this.localValue();
		if (!current) return;
		this.save.emit(current);
	}

	setFieldValue(key: string, newValue: unknown): void {
		const current = this.localValue();
		if (!current) return;
		(current as Record<string, unknown>)[key] = newValue;
		this.localValue.set({ ...(current as Record<string, unknown>) } as T);
	}

	getFieldValue(key: string): unknown {
		const current = this.localValue();
		return (current as Record<string, unknown>)?.[key] ?? '';
	}

	getFieldIcon(fieldType: EntityFieldType): string {
		switch (fieldType) {
			case EntityFieldType.TEXT:
				return 'bi-fonts';
			case EntityFieldType.NUMBER:
				return 'bi-hash';
			case EntityFieldType.EMAIL:
				return 'bi-envelope-at';
			case EntityFieldType.TEXTAREA:
				return 'bi-body-text';
			default:
				return '';
		}
	}
}
