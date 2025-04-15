import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import {
	ButtonWrapperComponent,
	GenericBtnComponent,
} from "@app/components/html";
import { appRoutes } from "@app/constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { logoutSelection } from "./logoutSelection";

@Component({
	selector: "app-logout-modal",
	imports: [CommonModule, GenericBtnComponent, ButtonWrapperComponent],
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
