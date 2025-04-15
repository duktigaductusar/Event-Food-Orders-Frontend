import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MsalService } from "@azure/msal-angular";

@Component({
	selector: "app-logout-success",
	standalone: true,
	imports: [RouterLink],
	templateUrl: "./logout-success.component.html",
	styleUrls: ["./logout-success.component.css"],
})
export class LogoutSuccessComponent implements OnInit {
	constructor(private readonly msalService: MsalService) {}

	ngOnInit(): void {
		sessionStorage.removeItem("msal.interaction.status");
		this.msalService.instance.clearCache();
	}
}
