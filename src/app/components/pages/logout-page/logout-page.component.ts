import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { AuthenticationService } from "@app/services";

@Component({
	selector: "app-logout-page",
	templateUrl: "./logout-page.component.html",
	imports: [],
	styleUrl: "./logout-page.component.css",
})
export class LogoutPageComponent extends AppBaseComponent {
    constructor (private authService: AuthenticationService){
        super()
        this.authService.logout();
    }
}
