import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLogEntry, Page } from '../../types/audit-log-entry';

@Injectable({
	providedIn: 'root',
})
export class AuditLogService {
	readonly API_BASE: string = `${environment.apiUrl}/audit`;

	constructor(private httpClient: HttpClient) {}

	public getLogs(page: number, size: number, sort?: string): Observable<Page<AuditLogEntry>> {
		let params = new HttpParams().set('page', String(page)).set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<Page<AuditLogEntry>>(`${this.API_BASE}/logs`, { params });
	}

	public getLogsByDateRange(
		start: Date,
		end: Date,
		page: number,
		size: number,
		sort?: string,
	): Observable<Page<AuditLogEntry>> {
		let params = new HttpParams()
			.set('start', start.toISOString())
			.set('end', end.toISOString())
			.set('page', String(page))
			.set('size', String(size));

		if (sort) {
			params = params.set('sort', sort);
		}

		return this.httpClient.get<Page<AuditLogEntry>>(`${this.API_BASE}/logs/date-range`, { params });
	}
}
