import { Component } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { LogoutComponent } from "@app/components/features/auth";

@Component({
	selector: "app-logout-page",
	templateUrl: "./logout-page.component.html",
	imports: [LogoutComponent],
})
export class LogoutPageComponent extends AppBaseComponent {}
