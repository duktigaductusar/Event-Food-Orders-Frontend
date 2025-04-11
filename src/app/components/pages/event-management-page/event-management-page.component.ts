import { Component } from "@angular/core";
import {
	EventManagementHubComponent,
	MainLayoutComponent,
} from "@app/components";

@Component({
	selector: "app-event-management-page",
	imports: [MainLayoutComponent, EventManagementHubComponent],
	templateUrl: "./event-management-page.component.html",
	styleUrl: "./event-management-page.component.css",
})
export class EventManagementPageComponent {}
