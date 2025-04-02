import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-error-modal",
	standalone: true,
	template: `
		<div class="modal-header bg-danger text-white">
			<h5 class="modal-title">{{ title }}</h5>
			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				(click)="close()"
			></button>
		</div>
		<div class="modal-body">
			<p>{{ message }}</p>
			<button class="btn btn-outline-secondary mt-2" (click)="close()">
				Close
			</button>
		</div>
	`,
})
export class ErrorModalComponent {
	@Input() title = "";
	@Input() message = "";

	constructor(public activeModal: NgbActiveModal) {}

	close(): void {
		this.activeModal.close();
	}
}
