/// <reference types="@angular/localize" />

import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig, msalInstance } from "./app/app.config";
import { AppComponent } from "./app/app.component";

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
		return bootstrapApplication(AppComponent, appConfig);
	})
	.catch((error: any) => {
		console.error("MSAL Initialization error: ", error);
	});
