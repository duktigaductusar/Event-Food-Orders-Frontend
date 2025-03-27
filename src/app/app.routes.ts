import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	HomePageComponent,
	LoginPageComponent,
	LogoutPageComponent,
} from "@app/components";
import { appRoutes } from "./constants";
import { MsalGuard } from "@azure/msal-angular";

export const routes: Routes = [
	{
		path: "",
		canActivate: [MsalGuard],
		children: [
			{
				path: appRoutes.HOME,
				component: HomePageComponent,
			},
			{
				path: appRoutes.EVENT_CREATE,
				component: EventCreatePageComponent,
			},
			{
				path: `${appRoutes.EVENT_DETAILS}/:id`,
				component: EventDetailsPageComponent,
			},
		],
	},
	{ path: appRoutes.LOGIN, component: LoginPageComponent },
	{
		path: appRoutes.LOGOUT,
		component: LogoutPageComponent,
		canActivate: [MsalGuard],
	},
	{ path: "**", redirectTo: "login" },
];
