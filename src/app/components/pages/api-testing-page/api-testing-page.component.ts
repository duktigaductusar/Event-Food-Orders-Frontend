import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MsalService } from "@azure/msal-angular";
import { environment } from "@environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AccountInfo, AuthenticationResult } from "@azure/msal-browser";

@Component({
	selector: "app-api-test",
	templateUrl: "./api-testing-page.component.html",
	imports: [],
})
export class ApiTestComponent extends AppBaseComponent {
	activeAccount: AccountInfo | null = null;
	constructor(
		private msalService: MsalService,
		private http: HttpClient
	) {
		super();
		this.activeAccount = this.msalService.instance.getActiveAccount();
	}

	handleOnClick(): void {
		if (!this.activeAccount) {
			console.error("No active account found.");
			return;
		}

		this.http.get(`${environment.apiUrl}/Auth/status`).subscribe({
			next: response => console.log("API response:", response),
			error: error => console.error("API call error:", error),
		});

		// const tokenRequest = {
		//     scopes: ["openid", "email", "Mail.Send", "profile"],
		//     account: this.activeAccount
		// };

		// this.msalService.acquireTokenSilent(tokenRequest)
		// .subscribe({
		//   next: (result: AuthenticationResult) => {
		//     const headers = new HttpHeaders({
		//       'Authorization': `Bearer ${result.idToken}`
		//     });
		//     this.http.get(`${environment.apiUrl}/Auth/status`, { headers })
		//       .subscribe({
		//         next: (response) => console.log('API response:', response),
		//         error: (error) => console.error('API call error:', error)
		//       });
		//   },
		//   error: (error) => console.error('Token acquisition error:', error)
		// });
	}
}
