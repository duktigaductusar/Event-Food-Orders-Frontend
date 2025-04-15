import { Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IEventDetailDto } from "@app/models";
import { AppBaseComponent } from "@app/components/base";
import { GenericBtnComponent } from "@app/components/html";

import { EventManagementHubComponent } from "../event-management-hub/event-management-hub.component";

@Component({
	selector: "app-event-management-delete-modal-component",
	imports: [GenericBtnComponent],
	templateUrl: "./event-management-delete-modal.component.html",
	styleUrl: "./event-management-delete-modal.component.css",
})
export class EventManagementDeleteModalComponentComponent extends AppBaseComponent {
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDetailDto | null = null;
	@Input() manager: EventManagementHubComponent | null = null;

	callDeleteMethod(): void {
		this.manager?.deleteEvent();
		this.activeModal.close();
	}
}
