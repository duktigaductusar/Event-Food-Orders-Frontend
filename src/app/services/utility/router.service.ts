import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { appRoutes } from "@app/constants";

@Injectable({ providedIn: "root" })
export class RouterService {
	constructor(private readonly router: Router) {}

	goToHome() {
		this.router.navigate([appRoutes.HOME]);
	}

	isBaseRoute(eventId?: string): boolean {
		return (
			this.router.url === `/${appRoutes.EVENT_CREATE}` ||
			this.router.url === `/${appRoutes.EVENT_DETAILS}/${eventId}` ||
			this.router.url === `/${appRoutes.EVENT_MANAGEMENT}/${eventId}`
		);
	}
}
