import { Component } from "@angular/core";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
	RouterOutlet,
} from "@angular/router";
import { LoggerService } from "./services/LoggingService/logger.service";
import { MsalService } from "@azure/msal-angular";
import { EventMessage } from "@azure/msal-browser";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, NgbModalModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	title = "dd-frontend";

	constructor(
		private router: Router,
		private logger: LoggerService,
		private msalService: MsalService
	) {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.logger.log(
					`Router NavigationStart to: ${event.url}. Done by: ${event.toString()}`
				);
			} else if (event instanceof NavigationEnd) {
				this.logger.log(
					`Router NavigationEnd at: ${event.url}. ID by: ${event.id}`
				);
			} else if (event instanceof NavigationCancel) {
				this.logger.log(
					`Router NavigationCancel: ${event.url}. Done by: ${event.id}`
				);
			} else if (event instanceof NavigationError) {
				this.logger.log(
					`Router NavigationError: ${event.error}. Done by: ${event.target}`
				);
			}
		});
		this.msalService.instance.addEventCallback((event: EventMessage) => {
			this.logger.log(`MSAL event: ${event.eventType}`);
			// Optionally, log event details:
			// this.logger.log(`MSAL event details: ${JSON.stringify(event)}`);
		});
	}
}
