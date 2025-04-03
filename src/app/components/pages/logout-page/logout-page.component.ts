import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MsalService } from "@azure/msal-angular";
import { environment } from "@environments/environment.development";

@Component({
	selector: "app-logout-page",
	templateUrl: "./logout-page.component.html",
	imports: [],
	styleUrl: "./logout-page.component.css",
})
export class LogoutPageComponent extends AppBaseComponent {
	constructor(private msalService: MsalService) {
		super();
		this.msalService.logoutRedirect({
			postLogoutRedirectUri: environment.azureAd.logoutRedirectUri,
		});
	}
}
