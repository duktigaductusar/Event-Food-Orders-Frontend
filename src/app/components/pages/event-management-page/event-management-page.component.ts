import { Component } from "@angular/core";

import { EventManagementHubComponent } from "@app/components/features";
import { MainLayoutComponent } from "@app/components/layouts";

@Component({
	selector: "app-event-management-page",
	imports: [MainLayoutComponent, EventManagementHubComponent],
	templateUrl: "./event-management-page.component.html",
	styleUrl: "./event-management-page.component.css",
})
export class EventManagementPageComponent {}
