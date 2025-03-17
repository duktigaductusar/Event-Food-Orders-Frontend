import { Routes } from '@angular/router';
import {
    EventCreatePageComponent,
    EventDetailsPageComponent,
    EventInvitePageComponent,
    HomePageComponent,
    LoginPageComponent
} from '@app/components';
import { ROUTES } from './constants';

export const routes: Routes = [
	{
		path: '',
		children: [
			{ path: ROUTES.HOME, component: HomePageComponent },
            { path: ROUTES.EVENT_CREATE, component: EventCreatePageComponent },
			{ path: ROUTES.EVENT_DETAILS, component: EventDetailsPageComponent },
			{ path: ROUTES.EVENT_INVITE, component: EventInvitePageComponent },
		],
	},
	{ path: ROUTES.LOGIN, component: LoginPageComponent },
	{ path: '**', redirectTo: '' },
];
