import { Component, inject, Input } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { GenericBtnComponent } from "@app/components/html";
import { IEventDetailDto } from "@app/models/eventDtos/IEventDetailDto.model";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EventManagementFormComponent } from "../event-management-form.component";

@Component({
	selector: "app-event-management-delete-modal-component",
	imports: [GenericBtnComponent],
	templateUrl: "./event-management-delete-modal-component.component.html",
	styleUrl: "./event-management-delete-modal-component.component.css",
})
export class EventManagementDeleteModalComponentComponent extends AppBaseComponent {
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDetailDto | null = null;
	@Input() manager: EventManagementFormComponent | null = null;

	callDeleteMethod(): void {
		console.log("Delete method called from modal. Manager: ", this.manager);
		this.manager?.deleteEvent();
		this.activeModal.close();
	}
}
