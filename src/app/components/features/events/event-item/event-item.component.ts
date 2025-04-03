// todo: this service uses state
import { Component, input, output, signal } from "@angular/core";
import type {
	IEventDto,
	IParticipantForResponseDto,
	IParticipantForUpdateDto,
} from "@app/models";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { DatetimelabelComponent } from "@app/components/shared/datetimelabel/datetimelabel.component";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";
import { Router } from "@angular/router";
import { appRoutes } from "@app/constants";
import { EventService, EventStateService } from "@app/services";
import { StatusLabelComponent } from "../../../shared";
import type { ParticipantResponseType } from "@types";
import { fromDateTimeISOString } from "@app/utility";
import { ParticipantService } from "@app/services/api/participant.service";

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
	eventDto = input<IEventDto | null>(null);
	participantId = input<string>();
	isPending = signal(false);
	participantResult = output<IParticipantForResponseDto>();
	participantResponseTypes: ParticipantResponseType[] = [
		"PENDING",
		"ATTENDING_ONLINE",
		"ATTENDING_OFFICE",
		"NOT_ATTENDING",
	];

	constructor(
		private router: Router,
		private eventService: EventService,
		public eventStateService: EventStateService,
		private participantService: ParticipantService
	) {
		super();
	}

	onAction(event: Event, action: ParticipantResponseType): void {
		event.stopPropagation();
		const Dto: Partial<IParticipantForUpdateDto> = {
			responseType: action,
		};

		const currentParticipantId = this.participantId();

		if (currentParticipantId == null) return;

		this.isPending.set(true);
		this.participantService
			.respondToEvent(Dto, currentParticipantId)
			.subscribe({
				next: result => {
					this.participantResult.emit(result);
				},
				error: error => console.error("Test error" + error),
				complete: () => this.isPending.set(false),
			});
	}

	selectedEvent() {
		if (this.isPending() || this.eventDto() == null) {
			return;
		}
		this.eventStateService.setSelectedEvent(this.eventDto()!);
		this.router.navigate([
			`/${appRoutes.EVENT_DETAILS}`,
			this.eventDto()!.id,
		]);
	}

	fromDateTimeISOStringForEventDto() {
		return fromDateTimeISOString(this.eventDto()!.date);
	}

	editEvent() {
		if (this.isPending() || this.eventDto() == null) {
			return;
		}
		this.eventStateService.setSelectedEvent(this.eventDto()!);
		this.router.navigate([
			`/${appRoutes.EVENT_MANAGEMENT}`,
			this.eventDto()!.id,
		]);
	}
}
