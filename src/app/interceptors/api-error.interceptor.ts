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
import { TranslateService } from "@app/services";

interface IDefaultErrorMessage {
	status: number;
	statusText: string;
	message: string;
}

export class ApiError {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly message: string,
		public readonly defaultErrorMessage?: IDefaultErrorMessage
	) {}

	static fromHttpError(
		error: HttpErrorResponse,
		defaultErrorMessage?: IDefaultErrorMessage
	): ApiError {
		console.log("status:", error.status);

		const statusText =
			error?.statusText ??
			defaultErrorMessage?.statusText ??
			"Unknown error type";
		const message =
			typeof error?.error === "string"
				? error.error
				: (defaultErrorMessage?.message ??
					"Unknown server error, please try again later");
		const status =
			error?.status === 0 || error?.status == null
				? (defaultErrorMessage?.status ?? 500)
				: error.status;

		return new ApiError(status, statusText, message);
	}
}

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
	private readonly defaultErrorMessage: IDefaultErrorMessage;

	constructor(
		private readonly errorService: ApiErrorService,
		private readonly router: Router,
		private readonly translateService: TranslateService
	) {
		this.defaultErrorMessage = {
			status: 500,
			statusText: this.translateService.t(
				"shared.erroModal.defaultStatusText"
			),
			message: this.translateService.t(
				"shared.erroModal.defaultStatusText"
			),
		};
	}

	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				const apiError = ApiError.fromHttpError(
					error,
					this.defaultErrorMessage
				);
				const forbiddenRequests = [401, 403];

				if (forbiddenRequests.includes(apiError.status)) {
					this.navigateForbiddenRequestToHomePage();
				} else {
					this.displayErroMessageToUser(apiError);
				}

				return throwError(() => apiError);
			})
		);
	}

	private navigateForbiddenRequestToHomePage() {
		this.router.navigate([appRoutes.HOME]);
	}

	private displayErroMessageToUser(apiError: ApiError) {
		this.errorService.showError(
			apiError.message,
			`${apiError.status}: ${apiError.statusText}`
		);
	}
}
