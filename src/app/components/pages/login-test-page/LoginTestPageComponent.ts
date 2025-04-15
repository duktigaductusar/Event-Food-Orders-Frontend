import { Component } from "@angular/core";
import { appRoutes } from "@app/constants";
import { AuthService } from "@app/services";

@Component({
	selector: "app-test-component",
	template: `<div>
		<button (click)="loginHome()">Login Home</button>
		<button (click)="loginDynamic()">Login dynamic</button>
	</div>`,
})
export class LoginTestPageComponent {
	constructor(private readonly authService: AuthService) {}

	loginHome() {
		this.authService.login(`${appRoutes.HOME}/`);
	}

	loginDynamic() {
		this.authService.login(`${appRoutes.EVENT_CREATE}/`);
	}
}
