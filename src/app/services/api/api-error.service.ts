import { Injectable } from "@angular/core";
import { ErrorModalComponent } from "@app/components/html/error-modal/error-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "..";

@Injectable({ providedIn: "root" })
export class ApiErrorService {
	private modalIsOpen = false;
	private modalDuration = 20000;

	constructor(
		private readonly modalService: NgbModal,
		private readonly translateService: TranslateService
	) {}

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
		modalRef.componentInstance.closeBtnLabel = this.translateService.t(
			"shared.erroModal.closeBtn"
		);

		const autoCloseTimeout = setTimeout(() => {
			if (this.modalIsOpen) {
				modalRef.close();
			}
		}, this.modalDuration);

		modalRef.result.finally(() => {
			this.modalIsOpen = false;
			clearTimeout(autoCloseTimeout);
		});
	}
}
