import { MsalInterceptorConfiguration } from "@azure/msal-angular";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";

import { environment } from "@environments/environment";

export function MSALInstanceFactory(): PublicClientApplication {
	return new PublicClientApplication({
		auth: {
			clientId: environment.azureAd.clientId,
			authority: environment.azureAd.authority,
			redirectUri: environment.azureAd.loginRedirectUri,
			navigateToLoginRequestUrl: false,
		},
		cache: {
			cacheLocation: "sessionStorage", //I don't like it but fine.
			storeAuthStateInCookie: false,
		},
	});
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
	const protectedResourceMap = new Map<string, string[]>();
	//Works on a prefix match. As long as the URL starts with the apiUrl found in environment then interceptor will append tokens.
	protectedResourceMap.set(`${environment.apiUrl}`, [
		`api://${environment.azureAd.apiId}/user`,
	]);
	return {
		interactionType: InteractionType.Redirect,
		protectedResourceMap,
	};
}

export const msalGuardConfig = {
	interactionType: InteractionType.Redirect,
	authRequest: {
		scopes: [],
	},
};

export const msalInterceptorConfig = {
	interactionType: InteractionType.Redirect,
	protectedResourceMap: new Map<string, string[]>([
		["https://graph.microsoft.com/v1/me", ["Mail.Send"]],
	]),
};

export const msalInstance = MSALInstanceFactory();
export const msalInterceptor = msalInterceptorConfigFactory();
