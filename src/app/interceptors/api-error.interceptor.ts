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
import { GlobalErrorService } from "@app/services/utility/global-error.service";

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
	constructor(private errorService: GlobalErrorService) {}

	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				const apiError = ApiError.fromHttpError(error);

				if (![401, 403].includes(apiError.status)) {
					this.errorService.showError(
						apiError.message,
						`Error ${apiError.status}`
					);
				} else {
					// TODO Navigate to index on 401 and 403
					console.log("show error");
				}

				return throwError(() => apiError);
			})
		);
	}
}
