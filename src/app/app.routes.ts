import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	EventManagementPageComponent,
	HomePageComponent,
	LogoutPageComponent,
	LogoutSuccessPageComponent,
} from "@app/components";
import { appRoutes, appRoutesPara } from "./constants";
import { AuthGuard } from "./services";

export const routes: Routes = [
	{
		path: "",
		canActivate: [AuthGuard],
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
				path: `${appRoutes.EVENT_DETAILS}/:${appRoutesPara.eventId}`,
				component: EventDetailsPageComponent,
			},
			{
				path: `${appRoutes.EVENT_MANAGEMENT}/:${appRoutesPara.eventId}`,
				component: EventManagementPageComponent,
			},
			{ path: appRoutes.LOGOUT, component: LogoutPageComponent },
		],
	},
	{ path: appRoutes.LOGOUT_SUCCESS, component: LogoutSuccessPageComponent },
	{ path: "**", redirectTo: "" },
];
