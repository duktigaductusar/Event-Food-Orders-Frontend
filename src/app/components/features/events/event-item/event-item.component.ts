import { Component, Input, Output, EventEmitter } from "@angular/core";
import type { IEventDto, IParticipantForUpdateDto } from "@app/models";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { DatetimelabelComponent } from "@app/components/shared/datetimelabel/datetimelabel.component";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";
import { Router } from "@angular/router";
import { appRoutes } from "@app/constants";
import { EventService } from "@app/services";
import { StatusLabelComponent } from "../../../shared";
import type { ParticipantResponseType } from "@types";

@Component({
	selector: "app-event-item",
	standalone: true,
	imports: [
		DatetimelabelComponent,
		GenericBtnComponent,
		StatusLabelComponent,
	],
	templateUrl: "event-item.component.html",
	styleUrl: "event-item.component.css",
})
export class EventItemComponent extends AppBaseComponent {
	@Input() eventDto!: IEventDto;
	@Output() cardClick = new EventEmitter<void>();
	// @Output() actionClick = new EventEmitter<{
	// 	action: string;
	// 	eventDto: IEventDto;
	// }>();

	participantResponseTypes : ParticipantResponseType[] = ["PENDING", "ATTENDING_ONLINE", "ATTENDING_OFFICE", "NOT_ATTENDING"]

	constructor(
		private router: Router,
		private service: EventService
	) {
		super();
	}

	onAction(event: Event, action: ParticipantResponseType): void {
		event.stopPropagation(); // Prevent card click event
		// this.actionClick.emit({ action, eventDto: this.eventDto });
		const Dto:IParticipantForUpdateDto= {
			responseType: "PENDING",
			wantsMeal: false,
			allergies: '',
			preferences: ''
		}
		//todo need to fetch participant id before updating the response
		// switch (action) {
		// 	case "PENDING":
		// 		return "Waiting for response...";
		// 	case "ATTENDING_ONLINE":
		// 		return "Participant is joining online.";
		// 	case "ATTENDING_OFFICE":
		// 		return "Participant is attending in the office.";
		// 	case "NOT_ATTENDING":
		// 		return "Participant is not attending.";
		// 	default:
		// 		return "Unknown response.";
		// }
	}

	onEdit(event: Event): void {
		event.stopPropagation();
		//this.actionClick.
	}

	selectedEvent() {
		this.service.setSelectedEvent(this.eventDto);
		this.router.navigate([`/${appRoutes.EVENT_DETAILS}`, this.eventDto.id]);
	}

	// selectMoreInfo() {
	// 	throw new Error("");
	// }

	// showInvitation() {
	// 	throw new Error("");
	// }
}
