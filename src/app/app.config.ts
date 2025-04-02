import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from "./app.routes";
import {
	MSAL_INSTANCE,
	MSAL_GUARD_CONFIG,
	MSAL_INTERCEPTOR_CONFIG,
	MsalService,
	MsalGuard,
	MsalBroadcastService,
	MsalInterceptor,
	MsalInterceptorConfiguration,
} from "@azure/msal-angular";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { environment } from "@environments/environment.development";
import { debuggingInterceptor } from "./components/pages/api-testing-page/debuggingInterceptor";

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

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration{
	const protectedResourceMap = new Map<string, string[]>();
	//Works on a prefix match. As long as the URL starts with the apiUrl found in environment then interceptor will append tokens.
	protectedResourceMap.set(`${environment.apiUrl}`, [`api://${environment.azureAd.apiId}/user`]);
	return {
		interactionType: InteractionType.Redirect,
		protectedResourceMap
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

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: MSAL_INSTANCE, useValue: msalInstance },
		{ provide: MSAL_GUARD_CONFIG, useValue: msalGuardConfig },
		{ provide: MSAL_INTERCEPTOR_CONFIG, useValue: msalInterceptor },
		MsalService,
		MsalGuard,
		MsalBroadcastService,
		{ provide: HTTP_INTERCEPTORS, useClass: debuggingInterceptor, multi: true},
		{ provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
		provideHttpClient(withInterceptorsFromDi()),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
	],
};
