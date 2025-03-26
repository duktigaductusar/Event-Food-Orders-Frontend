import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { CreateEventComponent } from "@app/components/features";
import { MainLayoutComponent } from "@app/components/layouts";

@Component({
	selector: "app-event-create-page",
	standalone: true,
	imports: [MainLayoutComponent, CreateEventComponent],
	templateUrl: "./event-create-page.component.html",
	styleUrl: "./event-create-page.component.css",
})
export class EventCreatePageComponent extends AppBaseComponent {}
