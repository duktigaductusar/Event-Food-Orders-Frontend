import { Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ngbd-modal-basic',
	imports: [NgbDatepickerModule],
	templateUrl: './simple-modal.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class NgbdModalBasic {
	private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');

	open(content: TemplateRef<any>) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			container: 'body',
			backdrop: true,
			centered: true,
		}).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}


	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}