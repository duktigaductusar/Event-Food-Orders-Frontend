import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EventItemComponent } from "../event-item/event-item.component";
import { IEventDto } from "@app/models";
import { EventService } from "@app/services";
import { AppBaseComponent } from "@app/components/base/app-base.component";

@Component({
	selector: "app-event-list",
	standalone: true,
	imports: [FormsModule, EventItemComponent],
	templateUrl: "./event-list.component.html",
})
export class EventListComponent extends AppBaseComponent implements OnInit {
	cards: IEventDto[] = [];
	currentPage = 1;
	itemsPerPage = 8;

	constructor(private eventService: EventService) {
		super();
	}

	ngOnInit(): void {
		this.loadEvents();
	}

	loadEvents(): void {
		this.eventService.getEvents().subscribe(events => {
			console.log(events);
			this.cards = events;
		});
	}

	getCurrentPageItems(): IEventDto[] {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		return this.cards.slice(startIndex, startIndex + this.itemsPerPage);
	}

	onCardSelected(card: IEventDto): void {
		console.log("Card selected:", card);
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
				this.eventService.updateEventResponse(
					event.card.id,
					"ATTENDING_ONLINE"
				);
				break;
			case "attend_office":
				this.eventService.updateEventResponse(
					event.card.id,
					"ATTENDING_OFFICE"
				);
				break;
			case "decline":
				this.eventService.updateEventResponse(
					event.card.id,
					"NOT_ATTENDING"
				);
				break;
			case "cancel_attendance":
			case "undo_decline":
				this.eventService.updateEventResponse(event.card.id, "PENDING");
				break;
		}

		// Refresh events
		this.loadEvents();
	}
}
