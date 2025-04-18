// Deprecated 28/3/2025 - RR. Login process should be started automatically, use MSAL Guard from "/".

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MsalService } from "@azure/msal-angular";
import { environment } from "@environments/environment.development";

@Component({
	selector: "app-login-page",
	templateUrl: "./login-page.component.html",
	imports: [],
	styleUrl: "./login-page.component.css",
})
export class LoginPageComponent extends AppBaseComponent {
	constructor(
		private msalService: MsalService,
		private router: Router
	) {
		super();

		if (this.msalService.instance.getActiveAccount() != null) {
			this.router.navigate(["/"]);
		}
	}

	handleOnClick(): void {
		this.msalService.loginRedirect({
			scopes: [],
		});
	}
}
