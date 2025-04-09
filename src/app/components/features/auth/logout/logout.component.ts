import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { environment } from "@environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { logoutSelection } from "./logout-modal/logoutSelection";
import { LogoutModalComponent } from "./logout-modal/logout-modal.component";

@Component({
	selector: "app-logout",
	imports: [],
	templateUrl: "./logout.component.html",
})
export class LogoutComponent implements OnInit {
	constructor(
		private modalService: NgbModal,
		private msalService: MsalService
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
			.then(result => {
				if (result === logoutSelection.logout) {
					this.msalService.logoutRedirect({
						postLogoutRedirectUri:
							environment.azureAd.logoutRedirectUri,
					});
				}
			})
			.catch(reason => {
				console.log("Modal dismissed:", reason);
			});
	}
}
