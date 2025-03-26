import { Component } from "@angular/core";
import {
	Router,
	NavigationEnd,
	RouterOutlet,
	NavigationStart,
	NavigationCancel,
	NavigationError,
} from "@angular/router";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	title = "dd-frontend";

	constructor(private router: Router) {
		// USED TO DEBUG ISSUE WITH ROUTING.
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				console.log("	NavigationStart:", event.url);
			}
			if (event instanceof NavigationEnd) {
				console.log("NavigationEnd:", event.urlAfterRedirects);
			}
			if (event instanceof NavigationCancel) {
				console.warn("NavigationCancel:", event.reason);
			}
			if (event instanceof NavigationError) {
				console.error("NavigationError:", event.error);
			}
		});
	}
}
