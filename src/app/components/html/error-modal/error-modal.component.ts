import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { GenericBtnComponent } from "../generic-btn/generic-btn.component";

@Component({
	selector: "app-error-modal",
	standalone: true,
	templateUrl: "./error-modal.component.html",
	imports: [GenericBtnComponent],
})
export class ErrorModalComponent {
	@Input() title = "";
	@Input() message = "";

	constructor(public activeModal: NgbActiveModal) {}

	close(): void {
		this.activeModal.close();
	}
}
