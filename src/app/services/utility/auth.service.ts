import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { msalInstance } from "@app/auth";
import { appRoutes } from "@app/constants";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { InteractionStatus } from "@azure/msal-browser";
import { filter, Subject, takeUntil } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AuthService implements OnDestroy {
	private readonly destroy$ = new Subject<void>();

	constructor(
		private msalService: MsalService,
		private readonly msalBroadcastService: MsalBroadcastService,
		private readonly router: Router
	) {}

	initHandleRedirect(): void {
		this.msalService.instance
			.handleRedirectPromise()
			.then(result => {
				console.log("MSAL Result", result);

				if (result !== null && result.state) {
					console.log("Redirecting to state:", result.state);
					this.router.navigateByUrl(result.state);
				}
			})
			.catch(error => {
				console.error("handleRedirectPromise error:", error);
			})
			.finally(() => {
				this.handlePostLoginRedirect();
			});
	}

	// TODO! Enhance authentication with events
	// E.g., // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/events.md#the-inprogress-observable
	// Other events to use after authentication
	// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/events.md
	handlePostLoginRedirect(): void {
		this.msalBroadcastService.inProgress$
			.pipe(
				filter(status => status === InteractionStatus.None),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				const account = this.msalService.instance.getActiveAccount();
				if (account == null) {
					console.log("No active account");
				}

				console.log("Active account after login:", account);
			});
	}

	getActiveAcoountUserId(): string | undefined {
		const account = this.msalService.instance.getActiveAccount();
		return account?.idTokenClaims?.oid;
	}

	login(targetRoute: string): void {
		const account = this.msalService.instance.getActiveAccount();

		if (account != null) {
			this.router.navigateByUrl(targetRoute);
		} else {
			// Trigger MSAL login with state = targetRoute
			this.msalService.loginRedirect({
				scopes: [],
				state: targetRoute,
			});
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
