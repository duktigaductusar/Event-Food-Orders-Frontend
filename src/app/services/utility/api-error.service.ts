import { Injectable } from "@angular/core";
import { ErrorModalComponent } from "@app/components/html/error-modal/error-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({ providedIn: "root" })
export class ApiErrorService {
	private modalIsOpen = false;

	constructor(private modalService: NgbModal) {}

	showError(message: string, title = "An error occurred") {
		if (this.modalIsOpen) return;

		this.modalIsOpen = true;

		const modalRef = this.modalService.open(ErrorModalComponent, {
			backdrop: true,
			centered: true,
			backdropClass: "app-modal-custom",
			keyboard: true,
		});
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.message = message;

		const autoCloseTimeout = setTimeout(() => {
			if (this.modalIsOpen) {
				modalRef.close();
			}
		}, 10000);

		modalRef.result.finally(() => {
			this.modalIsOpen = false;
			clearTimeout(autoCloseTimeout);
		});
	}
}
