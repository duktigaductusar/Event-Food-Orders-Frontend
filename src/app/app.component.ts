import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
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
