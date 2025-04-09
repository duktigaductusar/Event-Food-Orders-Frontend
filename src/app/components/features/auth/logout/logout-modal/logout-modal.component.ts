import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { GenericBtnComponent } from "@app/components/html";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { logoutSelection } from "./logoutSelection";
import { appRoutes } from "@app/constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";

@Component({
	selector: "app-logout-modal",
	imports: [CommonModule, GenericBtnComponent],
	templateUrl: "./logout-modal.component.html",
	styleUrl: "./logout-modal.component.css",
})
export class LogoutModalComponent extends AppBaseComponent {
	activeModal = inject(NgbActiveModal);

	constructor(private readonly router: Router) {
		super();
	}

	closeByDismiss() {
		this.activeModal.dismiss(logoutSelection.close);
		this.navigateHome();
	}

	closeByCancel() {
		this.activeModal.close(logoutSelection.close);
		this.navigateHome();
	}

	navigateHome() {
		this.router.navigate([appRoutes.HOME]);
	}

	logout() {
		this.activeModal.close(logoutSelection.logout);
	}
}
