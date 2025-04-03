//todo
//1.Error handling

import { Component, signal, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EventItemComponent } from "../event-item/event-item.component";
import { IEventDto, IParticipantForResponseDto } from "@app/models";
import { EventService } from "@app/services";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { SpinnerComponent } from "@app/components/shared";

@Component({
	selector: "app-event-list",
	standalone: true,
	imports: [FormsModule, EventItemComponent, SpinnerComponent],
	templateUrl: "./event-list.component.html",
})
export class EventListComponent extends AppBaseComponent implements OnInit {
	eventDtos: IEventDto[] = [];
	filteredEventDtos: IEventDto[] = [];
	showOnlyOwned = false;
	currentPage = 1;
	itemsPerPage = 16;
	isPending = signal(false);

	constructor(private eventService: EventService) {
		super();
	}

	ngOnInit(): void {
		this.loadEvents();
	}

	loadEvents(): void {
		this.isPending.set(true);
		this.eventService.getEvents().subscribe({
			next: events => {
				this.eventDtos = events;
				this.applyFilter();
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}

	toggleOwnedEvents(event: Event): void {
		this.showOnlyOwned = (event.target as HTMLInputElement).checked;
		this.applyFilter();
	}

	applyFilter(): void {
		if (this.showOnlyOwned) {
			this.filteredEventDtos = this.eventDtos.filter(
				event => event.isOwner
			);
		} else {
			this.filteredEventDtos = [...this.eventDtos];
		}
	}

	updateEventResponse(
		id: string,
		newResponse:
			| "PENDING"
			| "ATTENDING_ONLINE"
			| "ATTENDING_OFFICE"
			| "NOT_ATTENDING"
	): void {
		const event = this.eventDtos.find(event => event.id === id);
		if (event) {
			event.responseType = newResponse;
		}
	}

	getCurrentPageItems(): IEventDto[] {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		return this.filteredEventDtos.slice(
			startIndex,
			startIndex + this.itemsPerPage
		);
	}

	onActionTriggered(event: { action: string; card: IEventDto }): void {
		console.log(
			"Action triggered:",
			event.action,
			"for event:",
			event.card.title
		);

		switch (event.action) {
			case "attend_online":
				this.updateEventResponse(event.card.id, "ATTENDING_ONLINE");
				break;
			case "attend_office":
				this.updateEventResponse(event.card.id, "ATTENDING_OFFICE");
				break;
			case "decline":
				this.updateEventResponse(event.card.id, "NOT_ATTENDING");
				break;
			case "cancel_attendance":
			case "undo_decline":
				this.updateEventResponse(event.card.id, "PENDING");
				break;
		}

		this.loadEvents();
	}

	handleResponseType(response: IParticipantForResponseDto) {
		this.eventDtos = this.eventDtos.map(item =>
			item.id === response.eventId
				? { ...item, responseType: response.responseType }
				: item
		);
		this.applyFilter();
	}
}
