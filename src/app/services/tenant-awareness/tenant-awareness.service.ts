import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantAwarenessService {
	/**
	 * Extracts the tenant (subdomain), from the URL.
	 */
	getTenant(): string | null {
		const hostname = this.toHostname(window.location.hostname);

		if (!hostname || this.isLocalOrIp(hostname)) {
			return null;
		}

		const labels = hostname.split('.').filter(Boolean);
		if (labels.length < 3) return null;

		// If prefixed with www and we still have 3+ labels after it, skip www
		if (labels[0] === 'www' && labels.length >= 4) {
			return labels[1] || null;
		}

		return labels[0] || null;
	}

	private toHostname(value: string): string | null {
		if (!value) return null;

		const trimmed = value.trim().toLowerCase();

		try {
			// If it's a full URL, URL(...) will parse it
			const u = new URL(trimmed);
			return this.stripPort(u.hostname);
		} catch {
			// Not a full URL; treat as hostname possibly with port
			return this.stripPort(trimmed);
		}
	}

	private stripPort(hostname: string): string {
		const idx = hostname.indexOf(':');
		return idx >= 0 ? hostname.slice(0, idx) : hostname;
	}

	private isLocalOrIp(hostname: string): boolean {
		if (hostname === 'localhost' || hostname.endsWith('.localhost')) return true;
		return this.isIpAddress(hostname);
	}

	private isIpAddress(hostname: string): boolean {
		const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
		const ipv6 = /^([\da-f]{1,4}:){1,7}[\da-f]{1,4}$/i;
		return ipv4.test(hostname) || ipv6.test(hostname);
	}
}
