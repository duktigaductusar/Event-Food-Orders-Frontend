import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";
import {
	MSAL_INSTANCE,
	MSAL_GUARD_CONFIG,
	MSAL_INTERCEPTOR_CONFIG,
	MsalService,
	MsalGuard,
	MsalBroadcastService,
	MsalInterceptor,
} from "@azure/msal-angular";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { environment } from "@environments/environment.development";

export function MSALInstanceFactory(): PublicClientApplication {
	return new PublicClientApplication({
		auth: {
			clientId: environment.azureAd.clientId,
			authority: environment.azureAd.authority,
			redirectUri: environment.azureAd.loginRedirectUri,
			navigateToLoginRequestUrl: false
		},
		cache: {
			cacheLocation: "sessionStorage", //I don't like it but fine.
			storeAuthStateInCookie: false,
		},
	});
}

export const msalGuardConfig = {
	interactionType: InteractionType.Redirect,
	authRequest: {
		scopes: ["openid profile email Mail.Send"],
	},
};

export const msalInterceptorConfig = {
	interactionType: InteractionType.Redirect,
	protectedResourceMap: new Map<string, string[]>([
		["https://graph.microsoft.com/v1/me", ["Mail.Send"]],
	]),
};

export const msalInstance = MSALInstanceFactory();

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: MSAL_INSTANCE, useValue: msalInstance },
		{ provide: MSAL_GUARD_CONFIG, useValue: msalGuardConfig },
		{ provide: MSAL_INTERCEPTOR_CONFIG, useValue: msalInterceptorConfig },
		MsalService,
		MsalGuard,
		MsalBroadcastService,
		{ provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
		provideHttpClient(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(),
	],
};
