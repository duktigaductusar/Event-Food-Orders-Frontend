import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MainLayoutComponent } from "@app/components/layouts";
import { CreateEventComponent } from "../../features/events/create-event/create-event.component";

@Component({
	selector: "app-event-create-page",
	standalone: true,
	imports: [MainLayoutComponent, CreateEventComponent],
	templateUrl: "./event-create-page.component.html",
	styleUrl: "./event-create-page.component.css",
})
export class EventCreatePageComponent extends AppBaseComponent {}
