import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AppBaseComponent } from "@app/components/base";

import { appRoutes } from "@app/constants";

@Component({
	selector: "app-logout-success",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./logout-success.component.html",
	styleUrls: ["./logout-success.component.css"],
})
export class LogoutSuccessComponent extends AppBaseComponent {
	readonly appRoutes = appRoutes;
}
