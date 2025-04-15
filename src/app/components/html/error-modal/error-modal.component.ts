import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { GenericBtnComponent } from "../generic-btn/generic-btn.component";
import { ButtonWrapperComponent } from "../button-wrapper/button-wrapper.component";

@Component({
	selector: "app-error-modal",
	standalone: true,
	templateUrl: "./error-modal.component.html",
	imports: [GenericBtnComponent, ButtonWrapperComponent],
})
export class ErrorModalComponent {
	@Input() title = "";
	@Input() message = "";
	@Input() closeBtnLabel = "close";

	constructor(public activeModal: NgbActiveModal) {}

	close(): void {
		this.activeModal.close();
	}
}
