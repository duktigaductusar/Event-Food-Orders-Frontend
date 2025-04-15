import { Routes } from "@angular/router";
import {
	EventCreatePageComponent,
	EventDetailsPageComponent,
	HomePageComponent,
	LogoutPageComponent,
} from "@app/components";
import { appRoutes } from "./constants";
// import { MsalGuard } from "@azure/msal-angular";
import { EventManagementPageComponent } from "./components/pages/event-management-page/event-management-page.component";
// import { LoginTestPageComponent } from "./components/pages/login-test-page/LoginTestPageComponent";
import { AuthGuard } from "./services/utility/auth-guard.service";

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
	// {
	// 	path: "login",
	// 	component: LoginTestPageComponent,
	// },
	{ path: "**", redirectTo: "" },
];
