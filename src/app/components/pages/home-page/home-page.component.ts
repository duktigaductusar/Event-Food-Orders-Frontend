import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { EventListComponent } from "@app/components/features";
import { MainLayoutComponent } from "@app/components/layouts";

@Component({
	selector: "app-home-page",
	standalone: true,
	imports: [EventListComponent, MainLayoutComponent],
	templateUrl: "./home-page.component.html",
	styleUrl: "./home-page.component.css",
})
export class HomePageComponent extends AppBaseComponent {}
