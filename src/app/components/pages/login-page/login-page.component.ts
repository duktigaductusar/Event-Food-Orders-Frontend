import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MsalService } from "@azure/msal-angular";

@Component({
	selector: "app-login-page",
	templateUrl: "./login-page.component.html",
	imports: [],
	styleUrl: "./login-page.component.css",
})
export class LoginPageComponent extends AppBaseComponent {
	constructor(private msalService: MsalService) {
		super();
	}

	handleOnClick(): void {
		this.msalService.loginRedirect({
			scopes: ["Mail.Send"],
		});
	}
}
