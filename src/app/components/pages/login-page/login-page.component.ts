import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { AuthenticationService } from "@app/services/index";

@Component({
	selector: "app-login-page",
	imports: [],
	templateUrl: "./login-page.component.html",
	styleUrl: "./login-page.component.css",
})
export class LoginPageComponent extends AppBaseComponent {

	constructor(private authService: AuthenticationService) {
		super();
	}

	handleOnClick(): void{
		this.authService.login();
	}
}
