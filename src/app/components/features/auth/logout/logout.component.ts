import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

import { environment } from "@environments/environment";

import { logoutSelection } from "./logout-modal/logoutSelection";
import { LogoutModalComponent } from "./logout-modal/logout-modal.component";
import { appRoutes } from "@app/constants";

@Component({
	selector: "app-logout",
	imports: [],
	templateUrl: "./logout.component.html",
})
export class LogoutComponent implements OnInit {
	constructor(
		private readonly modalService: NgbModal,
		private readonly msalService: MsalService,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.openLogoutModal();
	}

	openLogoutModal() {
		const modalRef = this.modalService.open(LogoutModalComponent, {
			container: "body",
			backdrop: true,
			centered: true,
			backdropClass: "app-modal-custom",
		});
		modalRef.componentInstance.event = event;

		modalRef.result
			.then(reason => {
				console.log("reason: ", reason);
				if (reason === logoutSelection.logout) {
					console.log("reason: ", reason);
					this.msalService.logoutRedirect({
						postLogoutRedirectUri:
							environment.azureAd.logoutRedirectUri,
					});
					return;
				}

				if (
					reason === logoutSelection.backdrop ||
					reason === logoutSelection.esc
				) {
					this.router.navigate([appRoutes.HOME]);
					return;
				}
			})
			.catch(() => {
				this.router.navigate([appRoutes.HOME]);
			});
	}
}
