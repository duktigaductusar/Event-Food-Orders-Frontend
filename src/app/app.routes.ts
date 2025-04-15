import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	EventManagementPageComponent,
	HomePageComponent,
	LogoutPageComponent,
	LogoutSuccessPageComponent,
} from "@app/components";
import { appRoutes } from "./constants";
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
				path: `${appRoutes.EVENT_DETAILS}/:id`,
				component: EventDetailsPageComponent,
			},
			{
				path: `${appRoutes.EVENT_MANAGEMENT}/:id`,
				component: EventManagementPageComponent,
			},
			{ path: appRoutes.LOGOUT, component: LogoutPageComponent },
		],
	},
	{ path: appRoutes.LOGOUT_SUCCESS, component: LogoutSuccessPageComponent },
	{ path: "**", redirectTo: "" },
];
