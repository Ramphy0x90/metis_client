import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

function extractErrorMessage(error: HttpErrorResponse | unknown): string {
	if (error instanceof HttpErrorResponse) {
		const payload = error.error as unknown;

		if (payload && typeof payload === 'object' && typeof (payload as any).message === 'string') {
			return ((payload as any).message as string).trim();
		}

		// Raw string payload
		if (typeof payload === 'string' && payload.trim().length > 0) {
			return payload.trim();
		}

		// Network
		if (error.status === 0) {
			return 'Network error. Please check your internet connection.';
		}

		// Fallback to HttpErrorResponse message/status
		if (typeof error.message === 'string' && error.message.trim().length > 0) {
			return error.message.trim();
		}

		return error.statusText || `HTTP ${error.status}`;
	}

	return error && typeof (error as any).message === 'string'
		? ((error as any).message as string)
		: 'Unexpected error occurred.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastr = inject(ToastrService);

	return next(req).pipe(
		catchError((err: unknown) => {
			const isHttp = err instanceof HttpErrorResponse;
			const message = extractErrorMessage(err);

			if (isHttp) {
				const status = (err as HttpErrorResponse).status;
				if (status >= 400 && status < 500) {
					toastr.warning(message, 'Warning');
				} else if (status >= 500 || status === 0) {
					toastr.error(message, 'Error');
				} else {
					toastr.error(message, 'Error');
				}
			} else {
				toastr.error(message, 'Error');
			}

			return throwError(() => err);
		}),
	);
};
