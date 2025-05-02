import { Component, input, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs";

import type {
	IEventDto,
	IParticipantForResponseDto,
	IParticipantForUpdateResponseTypeDto,
} from "@app/models";
import { appRoutes } from "@app/constants";
import { EventStateService } from "@app/services";
import { fromDateTimeISOString, getShortTitle } from "@app/utility";
import { ParticipantService } from "@app/services";
import { AppBaseComponent } from "@app/components/base";
import {
	DatetimelabelComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import type { ParticipantResponseType } from "@types";
import { IconButtonComponent } from "@app/components/html";

@Component({
	selector: "app-event-item",
	standalone: true,
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		IconButtonComponent,
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
		public eventStateService: EventStateService,
		private participantService: ParticipantService
	) {
		super();
	}

	onAction(event: Event, action: ParticipantResponseType): void {
		event.stopPropagation();
		const dto: IParticipantForUpdateResponseTypeDto = {
			responseType: action,
		};

		const currentParticipantId = this.participantId();

		if (currentParticipantId == null) return;

		this.isPending.set(true);
		this.participantService
			.quickRespondToEvent(dto, currentParticipantId)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: result => {
					this.participantResult.emit(result);
				},
				error: error => console.error("Test error" + error),
			});
	}

	selectedEvent() {
		if (this.isPending() || this.eventDto() == null) {
			return;
		}

		if (this.eventDto()?.isOwner) {
			this.eventStateService.setSelectedEvent(this.eventDto()!);
			this.router.navigate([
				`/${appRoutes.EVENT_MANAGEMENT}`,
				this.eventDto()!.id,
			]);
		} else {
			this.eventStateService.setSelectedEvent(this.eventDto()!);
			this.router.navigate([
				`/${appRoutes.EVENT_DETAILS}`,
				this.eventDto()!.id,
			]);
		}
	}

	getShortTitle(title: string): string {
		return getShortTitle(title);
	}

	getDateFromStringValue(date: string) {
		return fromDateTimeISOString(date);
	}

	getNavigationTitle(): string {
		return this.eventDto()?.isOwner
			? this.t("events.handleYourEventTooltip")
			: this.t("events.respondToEventTooltip");
	}
}
