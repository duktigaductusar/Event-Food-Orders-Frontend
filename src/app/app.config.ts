import {
	ApplicationConfig,
	LOCALE_ID,
	provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withInterceptorsFromDi,
} from "@angular/common/http";
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
import {
	ApiErrorInterceptor,
	JsonContentTypeInterceptor,
} from "./interceptors";
import { msalInstance, msalGuardConfig, msalInterceptor } from "./auth.config";

export const appConfig: ApplicationConfig = {
	providers: [
		{ provide: LOCALE_ID, useValue: "sv-SE" },
		{ provide: MSAL_INSTANCE, useValue: msalInstance },
		{ provide: MSAL_GUARD_CONFIG, useValue: msalGuardConfig },
		{ provide: MSAL_INTERCEPTOR_CONFIG, useValue: msalInterceptor },
		MsalService,
		MsalGuard,
		MsalBroadcastService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApiErrorInterceptor,
			multi: true,
		},
		{ provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JsonContentTypeInterceptor,
			multi: true,
		},
		provideHttpClient(withInterceptorsFromDi()),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
	],
};
