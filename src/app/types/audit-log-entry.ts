export interface AuditLogEntry {
	id: string;
	operation: 'CREATE' | 'UPDATE' | 'DELETE';
	entityType: string;
	entityId: string;
	oldValues?: string | null;
	newValues?: string | null;
	performedBy: string;
	timestamp: string;
	tenantId?: string | null;
	description?: string | null;
}

export interface Page<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
	first?: boolean;
	last?: boolean;
}
