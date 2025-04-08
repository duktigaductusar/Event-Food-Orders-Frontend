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
import { ApiErrorService } from "@app/services/utility/api-error.service";
import { Router } from "@angular/router";
import { appRoutes } from "@app/constants";

export class ApiError {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly message: string
	) {}

	static fromHttpError(error: HttpErrorResponse): ApiError {
		const status = error.status ?? 0;
		const statusText = error?.statusText ?? "Unknown error type";
		const message = error?.error ?? "Unknown error";
		return new ApiError(status, statusText, message);
	}
}

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
	constructor(
		private readonly errorService: ApiErrorService,
		private readonly router: Router 
	) {}

	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				const apiError = ApiError.fromHttpError(error);
				const forbiddenRequests = [401, 403]

				if (forbiddenRequests.includes(apiError.status)) {
					this.navigateForbiddenRequestToHomePage()
				} else {
					this.displayErroMessageToUser(apiError)
				}

				return throwError(() => apiError);
			})
		);
	}

	private navigateForbiddenRequestToHomePage() {
		this.router.navigate([appRoutes.HOME])
	}

	private displayErroMessageToUser(apiError: ApiError) {
		this.errorService.showError(
			apiError.message,
			`${apiError.status}: ${apiError.statusText}`
		);
	}
}
