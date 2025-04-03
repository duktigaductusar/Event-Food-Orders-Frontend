import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class JsonContentTypeInterceptor implements HttpInterceptor {
	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const method = req.method.toUpperCase();
		const hasBody = req.body !== null && req.body !== undefined;

		const shouldAddJsonHeader =
			["POST", "PUT", "PATCH"].includes(method) &&
			hasBody &&
			!(req.body instanceof FormData) &&
			!(req.body instanceof Blob) &&
			!req.headers.has("Content-Type");

		if (shouldAddJsonHeader) {
			const cloned = req.clone({
				setHeaders: {
					"Content-Type": "application/json",
				},
			});
			return next.handle(cloned);
		}

		return next.handle(req);
	}
}
