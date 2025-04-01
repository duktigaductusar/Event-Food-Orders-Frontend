import { Component, input, signal } from "@angular/core";
import type { IEventDto, IParticipantForUpdateDto } from "@app/models";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { DatetimelabelComponent } from "@app/components/shared/datetimelabel/datetimelabel.component";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";
import { Router } from "@angular/router";
import { appRoutes } from "@app/constants";
import { EventService } from "@app/services";
import { StatusLabelComponent } from "../../../shared";
import type { ParticipantResponseType } from "@types";
import { ParticipantService } from "@app/services/participant/participant.service";

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
	eventDto = signal<IEventDto | null> (null)
	// @Input() eventDto!: IEventDto;
	participantId = input<string>()

	isPending = signal(false)

	participantResponseTypes : ParticipantResponseType[] = ["PENDING", "ATTENDING_ONLINE", "ATTENDING_OFFICE", "NOT_ATTENDING"]

	constructor(
		private router: Router,
		private eventService: EventService,
		private participantService: ParticipantService,
	) {
		super();
	}

	onAction(event: Event, action: ParticipantResponseType): void {
		event.stopPropagation();
		const Dto:Partial<IParticipantForUpdateDto>= {
			responseType: action,			
		}
		
		const currentParticipantId=this.participantId()

		if (currentParticipantId==null)
			return

		this.isPending.set(true)
		this.participantService.respondToEvent(Dto, currentParticipantId).subscribe({
			next: result => {
				console.log(result)
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		})
	}	

	onEdit(event: Event): void {
		event.stopPropagation();
		//to do implement this
	}

	selectedEvent() {
		if (this.isPending() || this.eventDto()==null){
			return
		}
		this.eventService.setSelectedEvent(this.eventDto()!);
		this.router.navigate([`/${appRoutes.EVENT_DETAILS}`, this.eventDto()!.id]);
	}



}
