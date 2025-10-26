import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { EntityModalComponent } from '../../components/entity-modal-component/entity-modal-component';
import { EntityTableComponent } from '../../components/entity-table-component/entity-table-component';
import {
	EntityField,
	EntityFieldSize,
	EntityFieldType,
	EntityFieldVisiblity,
} from '../../types/entity/field';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/identity/tenant/tenant-response';
import { BookingService } from '../../services/booking/booking';
import { TenantServiceResponse } from '../../types/booking/tenant-service/tenant-service-response';
import { TenantServiceCreateRequest } from '../../types/booking/tenant-service/tenant-service-create-request';

@Component({
	selector: 'app-services-page',
	imports: [CommonModule, EntityTableComponent, EntityModalComponent],
	templateUrl: './services-page.html',
	styleUrl: './services-page.scss',
})
export class ServicesPage {
	readonly TENANT_SERVICE_ENTITY_FIELDS: EntityField[] = [
		{
			key: 'id',
			label: 'ID',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'tenantId',
			label: 'Tenant',
			type: EntityFieldType.DROPDOWN,
			size: EntityFieldSize.MD,
			visibility: EntityFieldVisiblity.FORM,
			dropdownDataSourceID: 'tenants',
			dropdownDataLabelID: 'name',
		},
		{
			key: 'tenantName',
			label: 'Tenant',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.MD,
			visibility: EntityFieldVisiblity.TABLE,
		},
		{
			key: 'title',
			label: 'Title',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'description',
			label: 'Description',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.MD,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'durationMinutes',
			label: 'Duration',
			type: EntityFieldType.NUMBER,
			size: EntityFieldSize.SM,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'price',
			label: 'price',
			type: EntityFieldType.NUMBER,
			size: EntityFieldSize.SM,
			visibility: EntityFieldVisiblity.ALL,
		},
	] as const;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	private destroyed$: Subject<void> = new Subject();
	currentPage: number = 0;
	pageSize: number = 10;
	tenantServices = signal<TenantServiceResponse[]>([]);

	tenants: Signal<TenantResponse[]>;

	showModal = signal<boolean>(false);
	modalMode = signal<'create' | 'view' | 'edit'>('create');
	selectedService = signal<TenantServiceResponse | null>(null);

	dropdownOptions = computed<Record<string, unknown[]>>(() => ({
		tenants: this.tenants(),
		roles: this.identityStore.roleOptions(),
	}));

	constructor(private bookingService: BookingService) {
		this.tenants = this.identityStore.tenants;

		this.bookingService
			.getAllServices(this.currentPage, this.pageSize)
			.pipe(
				takeUntil(this.destroyed$),
				map((services) => services.content),
			)
			.subscribe((services) => {
				this.tenantServices.set(services);
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
	}

	onCreateServiceClick(): void {
		this.modalMode.set('create');
		this.selectedService.set({
			id: '',
			tenantId: '',
			tenantName: '',
			title: '',
			description: '',
			durationMinutes: 0,
			price: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		this.showModal.set(true);
	}

	onViewService(service: TenantServiceResponse): void {
		this.modalMode.set('view');
		this.selectedService.set(service);
		this.showModal.set(true);
	}

	onEditService(service: TenantServiceResponse): void {
		this.modalMode.set('edit');
		this.selectedService.set(service);
		this.showModal.set(true);
	}

	onModalCancel(): void {
		this.showModal.set(false);
	}

	onModalSave(updated: Partial<TenantServiceResponse>): void {
		const mode = this.modalMode();
		if (mode === 'create') {
			this.bookingService.createService(updated).pipe(take(1)).subscribe();
		} else if (mode === 'edit' && updated.id) {
			this.bookingService.updateService(updated.id, updated).pipe(take(1)).subscribe();
		}
		this.showModal.set(false);
	}
}
