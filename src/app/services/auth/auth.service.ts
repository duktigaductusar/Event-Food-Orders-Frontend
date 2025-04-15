import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";

import { msalInstance } from "@app/auth.config";
import { AccountInfo } from "@azure/msal-browser";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	constructor(
		private msalService: MsalService,
		private readonly router: Router
	) {}

	getActiveAccountUserId(): string | undefined {
		const account = msalInstance.getActiveAccount();
		return account?.idTokenClaims?.oid;
	}

	getAllAccounts(): AccountInfo[] {
		return msalInstance.getAllAccounts();
	}

	login(targetRoute: string): void {
		const account = msalInstance.getActiveAccount();

		if (account != null) {
			this.router.navigateByUrl(targetRoute);
		} else {
			this.msalService.loginRedirect({
				scopes: [],
				state: targetRoute,
			});
		}
	}
}
