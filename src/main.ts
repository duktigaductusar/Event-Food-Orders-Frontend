/// <reference types="@angular/localize" />

import { bootstrapApplication } from "@angular/platform-browser";
import localeSv from "@angular/common/locales/sv";
import { registerLocaleData } from "@angular/common";

import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { appRoutes } from "@app/constants";
import { msalInstance } from "@app/auth.config";

registerLocaleData(localeSv);

bootstrapApplicationWithMSAL();

function bootstrapApplicationWithMSAL() {
	clearMsalInteractionStatus();

	msalInstance
		.initialize()
		.then(() => msalInstance.handleRedirectPromise())
		.then(response => {
			if (response && response.account) {
				msalInstance.setActiveAccount(response.account);
			} else {
				const accounts = msalInstance.getAllAccounts();
				if (accounts.length > 0) {
					msalInstance.setActiveAccount(accounts[0]);
				}
			}

			if (response?.state) {
				console.log("Redirecting to dynamic state:", response.state);
				window.location.href = response.state;
				return;
			}

			return bootstrapApplication(AppComponent, appConfig);
		})
		.catch(error => {
			console.error("MSAL Initialization error: ", error);
		});
}

function clearMsalInteractionStatus(): void {
	if (window.location.pathname.includes(appRoutes.LOGOUT_SUCCESS)) {
		console.log(
			"Detected logout success page → Clearing msal.interaction.status"
		);
		sessionStorage.removeItem("msal.interaction.status");
	}
}
