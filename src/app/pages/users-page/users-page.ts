import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { DCardComponent } from '../../components/d-card-component/d-card-component';
import { EntityTableComponent } from '../../components/entity-table-component/entity-table-component';
import { EntityModalComponent } from '../../components/entity-modal-component/entity-modal-component';
import {
	EntityField,
	EntityFieldSize,
	EntityFieldType,
	EntityFieldVisiblity,
} from '../../types/entity/field';
import { IdentityStore } from '../../store/identity';
import { UserResponse } from '../../types/identity/user/user-response';
import { TenantResponse } from '../../types/identity/tenant/tenant-response';

@Component({
	selector: 'app-users-page',
	imports: [CommonModule, DCardComponent, EntityTableComponent, EntityModalComponent],
	templateUrl: './users-page.html',
	styleUrl: './users-page.scss',
})
export class UsersPage {
	readonly USER_ENTITY_FIELDS: EntityField[] = [
		{
			key: 'name',
			label: 'Name',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'surname',
			label: 'Surname',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'email',
			label: 'Email',
			type: EntityFieldType.EMAIL,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
		},
		{
			key: 'password',
			label: 'Password',
			type: EntityFieldType.PASSWORD,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.FORM,
		},
		{
			key: 'tenantId',
			label: 'Tenant',
			type: EntityFieldType.TEXT,
			size: EntityFieldSize.MD,
			visibility: EntityFieldVisiblity.TABLE,
			lookupDataID: 'name',
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
			key: 'roles',
			label: 'Role',
			type: EntityFieldType.DROPDOWN,
			size: EntityFieldSize.AUTO,
			visibility: EntityFieldVisiblity.ALL,
			dropdownDataSourceID: 'roles',
			dropdownDataLabelID: 'label',
		},
	] as const;

	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);
	tenants: Signal<TenantResponse[]>;
	users: Signal<UserResponse[]>;
	usersCount: Signal<number>;
	adminsCount: Signal<number>;
	employeesCount: Signal<number>;
	customersCount: Signal<number>;

	showModal = signal<boolean>(false);
	modalMode = signal<'create' | 'view' | 'edit'>('create');
	selectedUser = signal<UserResponse | null>(null);

	lookupData = computed<Record<string, TenantResponse>>(() =>
		Object.fromEntries(this.tenants().map((t) => [t.id, t])),
	);

	dropdownOptions = computed<Record<string, unknown[]>>(() => ({
		tenants: this.tenants(),
		roles: this.identityStore.roleOptions(),
	}));

	constructor() {
		this.tenants = this.identityStore.tenants;
		this.users = this.identityStore.users;
		this.usersCount = this.identityStore.usersTotalCount;
		this.adminsCount = this.identityStore.tenantsTotalAdmins;
		this.employeesCount = this.identityStore.tenantsTotalEmployees;
		this.customersCount = this.identityStore.tenantsTotalCustomers;

		// Load roles for dropdown options
		this.identityStore.loadUserRoles();
	}

	onSearchUsers(query: string): void {
		const q = (query ?? '').trim();

		if (q.length === 0) {
			this.identityStore.loadAllUsers();
			return;
		}

		this.identityStore.searchUsers({ q });
	}

	onCreateUserClick(): void {
		this.modalMode.set('create');
		this.selectedUser.set({
			id: '',
			name: '',
			surname: '',
			email: '',
			tenantId: '',
			roles: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		this.showModal.set(true);
	}

	onViewUser(user: UserResponse): void {
		this.modalMode.set('view');
		this.selectedUser.set(user);
		this.showModal.set(true);
	}

	onEditUser(user: UserResponse): void {
		this.modalMode.set('edit');
		this.selectedUser.set(user);
		this.showModal.set(true);
	}

	onDeleteUser(user: UserResponse): void {
		if (!user?.id) return;
		this.identityStore.deleteUser(user.id);
	}

	onModalCancel(): void {
		this.showModal.set(false);
	}

	onModalSave(updated: Partial<UserResponse>): void {
		const mode = this.modalMode();

		if (mode === 'create') {
			this.identityStore.createUser(updated);
		} else if (mode === 'edit' && updated.id) {
			this.identityStore.updateUser({ id: updated.id, changes: updated });
		}

		this.showModal.set(false);
	}
}
