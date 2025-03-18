import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	EventInvitePageComponent,
	HomePageComponent,
	LoginPageComponent,
} from "@app/components";
import { appRoutes } from "./constants";

export const routes: Routes = [
	{
		path: "",
		children: [
			{ path: appRoutes.HOME, component: HomePageComponent },
			{ path: appRoutes.EVENT_CREATE, component: EventCreatePageComponent },
			{
				path: appRoutes.EVENT_DETAILS,
				component: EventDetailsPageComponent,
			},
			{ path: appRoutes.EVENT_INVITE, component: EventInvitePageComponent },
		],
	},
	{ path: appRoutes.LOGIN, component: LoginPageComponent },
	{ path: "**", redirectTo: "" },
];
