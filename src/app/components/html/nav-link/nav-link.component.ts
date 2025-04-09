import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
	standalone: true,
	imports: [RouterModule],
	selector: "app-nav-link",
	templateUrl: "nav-link.component.html",
})
export class NavLinkComponent {
	@Input() route = "";
	@Input() label = "";
}
