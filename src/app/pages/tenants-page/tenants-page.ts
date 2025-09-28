import { CommonModule } from '@angular/common';
import {
	Component,
	effect,
	inject,
	Injector,
	OnInit,
	Signal,
	signal,
	computed,
} from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';
import { EntityTableComponent } from '../../components/entity-table-component/entity-table-component';
import { EntityModalComponent } from '../../components/entity-modal-component/entity-modal-component';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/tenant/tenant-response';
import {
	EntityField,
	EntityFieldSize,
	EntityFieldType,
	EntityFieldVisiblity,
} from '../../types/entity/field';

@Component({
	selector: 'app-tenants-page',
	imports: [CommonModule, DCardComponent, EntityTableComponent, EntityModalComponent],
	templateUrl: './tenants-page.html',
	styleUrl: './tenants-page.scss',
})
export class TenantsPage {
	readonly TENANT_ENTITY_FIELDS: EntityField[] = [
		{
			key: 'name',
			label: 'Name',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
			required: true,
		},
		{
			key: 'domain',
			label: 'Domain',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.MD,
			visibility: EntityFieldVisiblity.ALL,
			required: true,
		},
		{
			key: 'employees',
			label: 'Employees',
			type: EntityFieldType.NUMBER,
			size: EntityFieldSize.SM,
			visibility: EntityFieldVisiblity.TABLE,
			required: false,
		},
		{
			key: 'activeBookings',
			label: 'Active Bookings',
			type: EntityFieldType.NUMBER,
			size: EntityFieldSize.SM,
			visibility: EntityFieldVisiblity.TABLE,
			required: false,
		},
	] as const;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	tenants: Signal<TenantResponse[]>;
	tenantsCount: Signal<number>;

	showModal = signal<boolean>(false);
	modalMode = signal<'create' | 'view' | 'edit'>('create');
	selectedTenant = signal<TenantResponse | null>(null);

	constructor() {
		this.tenants = this.identityStore.tenants;
		this.tenantsCount = this.identityStore.tenantsTotalCount;
	}

	onCreateTenantClick(): void {
		this.modalMode.set('create');
		this.selectedTenant.set({
			id: '',
			name: '',
			domain: '',
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		this.showModal.set(true);
	}

	onViewTenant(tenant: TenantResponse): void {
		this.modalMode.set('view');
		this.selectedTenant.set(tenant);
		this.showModal.set(true);
	}

	onEditTenant(tenant: TenantResponse): void {
		this.modalMode.set('edit');
		this.selectedTenant.set(tenant);
		this.showModal.set(true);
	}

	onDeleteTenant(tenant: TenantResponse): void {
		if (!tenant?.id) return;
		this.identityStore.deleteTenant(tenant.id);
	}

	onModalCancel(): void {
		this.showModal.set(false);
	}

	onModalSave(updated: Partial<TenantResponse>): void {
		const mode = this.modalMode();
		if (mode === 'create') {
			this.identityStore.createTenant(updated);
		} else if (mode === 'edit' && updated.id) {
			this.identityStore.updateTenant({ id: updated.id, changes: updated });
		}
		this.showModal.set(false);
	}
}
