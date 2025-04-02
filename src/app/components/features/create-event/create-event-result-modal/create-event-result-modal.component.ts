import { CommonModule } from "@angular/common";
import { Component, inject, Input, output } from "@angular/core";
import { Router } from "@angular/router";
import { GenericBtnComponent } from "@app/components/html";
import { appRoutes } from "@app/constants";
import { IEventDto } from "@app/models";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { newEventResultSelection } from "../constants";

@Component({
	selector: "app-create-event-result-modal",
	imports: [CommonModule, GenericBtnComponent],
	standalone: true,
	templateUrl: "./create-event-result-modal.component.html",
})
export class CreateEventResultModalComponent {
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDto | null = null;
	createNewEvent = output();

	constructor(private readonly router: Router) { }

	navigateHomeByDismiss() {
		this.activeModal.dismiss(newEventResultSelection.crossSelection)
		this.navigateToHome()
	}

	navigateHomeByCancel() {
		this.activeModal.close(newEventResultSelection.homeSelection)
		this.navigateToHome()
	}

	navigateToHome() {
		this.router.navigate([
			`/${appRoutes.HOME}`,
		]);
	}

	navigateManageEvent(id: string) {
		this.activeModal.close(newEventResultSelection.manageEventSelection)
		this.router.navigate([
			`/${appRoutes.EVENT_MANAGEMENT}`,
			id
		]);
	}

	navigateCreateNewevent() {
		this.activeModal.close(newEventResultSelection.newEventFormSelection)
		// this.activeModal.close('Close click')
		// this.router.navigate([
		// 	`/${appRoutes.EVENT_CREATE}`,
		// ]);
	}
}
