import { Injectable } from "@angular/core";
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export class ApiError {
	constructor(
		public readonly status: number,
		public readonly message: string,
		public readonly error?: unknown
	) {}

	static fromHttpError(error: HttpErrorResponse): ApiError {
		const status = error.status ?? 0;
		const message =
			error?.error?.message ?? error?.message ?? "Unknown error";
		return new ApiError(status, message, error);
	}
}

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				const apiError = ApiError.fromHttpError(error);
				// TODO Show modal from here usign service and modal
				// Registered in app config etc...
				return throwError(() => apiError);
			})
		);
	}
}
