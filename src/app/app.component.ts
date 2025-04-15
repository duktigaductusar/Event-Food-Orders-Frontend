import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "./services";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, NgbModalModule],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent {
	title = "Ductus | Events Luleå";

	constructor(private authService: AuthService) {
		this.authService.initHandleRedirect();
	}
}

// main.ts:26 MSAL Initialization error:  BrowserAuthError: no_token_request_cache_error: No token request found in cache.
// at chunk-35ENWJA4.js:56:61
// at __async (chunk-35ENWJA4.js:40:10)
