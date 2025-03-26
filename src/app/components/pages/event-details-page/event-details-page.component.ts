import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { EventDetailItemComponent } from "@app/components/features";
import { MainLayoutComponent } from "../../layouts/main-layout/main-layout.component";

@Component({
	selector: "app-event-details-page",
	imports: [EventDetailItemComponent, MainLayoutComponent],
	templateUrl: "./event-details-page.component.html",
	styleUrl: "./event-details-page.component.css",
})
export class EventDetailsPageComponent extends AppBaseComponent {}
