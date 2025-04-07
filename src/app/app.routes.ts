import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	HomePageComponent,
	LoginPageComponent,
	LogoutPageComponent,
	ApiTestComponent,
} from "@app/components";
import { appRoutes } from "./constants";
import { MsalGuard } from "@azure/msal-angular";
import { EventManagementPageComponent } from "./components/pages/event-management-page/event-management-page.component";
import { XssDemoComponent } from "./components/pages/xss-demo/xss-demo.component";

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
			{
				path: `${appRoutes.EVENT_MANAGEMENT}/:id`,
				component: EventManagementPageComponent,
			},
			{
				path: "xss-attack",
				component: XssDemoComponent,
			},
		],
	},
	{ path: appRoutes.LOGIN, component: LoginPageComponent },
	{ path: appRoutes.TEST, component: ApiTestComponent },
	{
		path: appRoutes.LOGOUT,
		component: LogoutPageComponent,
		// canActivate: [MsalGuard]
	},
	{ path: "**", redirectTo: "" },
];
