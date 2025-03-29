import { Input, Component, inject, signal, WritableSignal } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello, {{ name }}!</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContentComponent {
	activeModal = inject(NgbActiveModal);

	@Input() name = "";
}

@Component({
	selector: 'app-simple-component',
	standalone: true,
	templateUrl: './simple-modal.component.html',
})
export class AppSimpleModalComponent {
	private modalService = inject(NgbModal);

	open() {
		const modalRef = this.modalService.open(NgbdModalContentComponent, {
			ariaLabelledBy: 'modal-basic-title',
			container: 'body',
			backdrop: true,
			centered: true,
			backdropClass: "app-modal-custom"
		})
		modalRef.componentInstance.name = 'Test World';
	}
}