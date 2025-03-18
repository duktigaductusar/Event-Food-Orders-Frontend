import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { MainLayoutComponent } from "@app/components/layouts";

@Component({
	selector: "app-event-create-page",
	imports: [MainLayoutComponent],
	templateUrl: "./event-create-page.component.html",
	styleUrl: "./event-create-page.component.css",
})
export class EventCreatePageComponent extends AppBaseComponent {}
