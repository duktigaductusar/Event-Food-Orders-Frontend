import { Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { IEventDetailDto } from "@app/models";
import {
	AppBaseComponent,
	EventManagementHubComponent,
	GenericBtnComponent,
} from "@app/components";

@Component({
	selector: "app-event-management-delete-modal-component",
	imports: [GenericBtnComponent],
	templateUrl: "./event-management-delete-modal-component.component.html",
	styleUrl: "./event-management-delete-modal-component.component.css",
})
export class EventManagementDeleteModalComponentComponent extends AppBaseComponent {
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDetailDto | null = null;
	@Input() manager: EventManagementHubComponent | null = null;

	callDeleteMethod(): void {
		console.log("Delete method called from modal. Manager: ", this.manager);
		this.manager?.deleteEvent();
		this.activeModal.close();
	}
}
