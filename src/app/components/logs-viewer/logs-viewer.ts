import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, computed, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../services/audit-log/audit-log';
import { AuditLogEntry, Page } from '../../types/audit-log-entry';
import { IdentityStore } from '../../store/identity';
import { TenantResponse } from '../../types/identity/tenant/tenant-response';
import { Role } from '../../types/identity/roles';

@Component({
	selector: 'logs-viewer',
	imports: [CommonModule, FormsModule],
	templateUrl: './logs-viewer.html',
	styleUrl: './logs-viewer.scss',
	standalone: true,
})
export class LogsViewer {
	private auditLogService: InstanceType<typeof AuditLogService> = inject(AuditLogService);
	private identityStore: InstanceType<typeof IdentityStore> = inject(IdentityStore);

	readonly currentTenant: Signal<TenantResponse | null> = this.identityStore.currentTenant;

	// Date range controls
	start = signal<string>('');
	end = signal<string>('');

	// Pagination state
	page = signal<number>(0);
	size = signal<number>(10);

	// Mode: 'latest' or 'range'
	mode = signal<'latest' | 'range'>('latest');

	// Data
	logs = signal<AuditLogEntry[]>([]);
	totalElements = signal<number>(0);
	totalPages = signal<number>(0);

	canPrev = computed(() => this.page() > 0);
	canNext = computed(() => this.page() + 1 < this.totalPages());

	constructor() {
		// Initialize with last 24 hours
		this.setLastDay();

		effect(() => {
			const mode = this.mode();
			const startIso = this.start();
			const endIso = this.end();
			const page = this.page();
			const size = this.size();
			const tenantID =
				this.identityStore.userMainRole() !== Role.GLOBAL_ADMIN
					? this.currentTenant()?.id
					: undefined;

			switch (mode) {
				case 'latest':
					this.auditLogService
						.getLogs(page, size, 'timestamp,DESC', tenantID)
						.subscribe((resp: Page<AuditLogEntry>) => {
							this.logs.set(resp.content ?? []);
							this.totalElements.set(resp.totalElements ?? 0);
							this.totalPages.set(resp.totalPages ?? 0);
						});
					break;
				case 'range':
					if (!startIso || !endIso) return;
					const startDate = this.toStartOfDay(startIso);
					const endDate = this.toEndOfDay(endIso);
					if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;

					this.auditLogService
						.getLogsByDateRange(startDate, endDate, page, size, 'timestamp,DESC')
						.subscribe((resp: Page<AuditLogEntry>) => {
							this.logs.set(resp.content ?? []);
							this.totalElements.set(resp.totalElements ?? 0);
							this.totalPages.set(resp.totalPages ?? 0);
						});

					break;
			}
		});
	}

	prevPage(): void {
		if (this.canPrev()) this.page.set(this.page() - 1);
	}

	nextPage(): void {
		if (this.canNext()) this.page.set(this.page() + 1);
	}

	setLastDay(): void {
		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		this.start.set(this.formatForInput(yesterday));
		this.end.set(this.formatForInput(now));
		this.page.set(0);
	}

	private formatForInput(date: Date): string {
		const pad = (n: number) => String(n).padStart(2, '0');
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1);
		const day = pad(date.getDate());
		return `${year}-${month}-${day}`;
	}

	private toStartOfDay(dateOnly: string): Date {
		const [y, m, d] = dateOnly.split('-').map((v) => parseInt(v, 10));
		return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
	}

	private toEndOfDay(dateOnly: string): Date {
		const [y, m, d] = dateOnly.split('-').map((v) => parseInt(v, 10));
		return new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999);
	}
}
