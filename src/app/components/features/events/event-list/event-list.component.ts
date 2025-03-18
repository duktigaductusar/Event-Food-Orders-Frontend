import { Component, type OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EventItemComponent } from "../event-item/event-item.component";
import { IEventDto } from "@app/models";
import { EventService } from "@app/services";

// @Component({
// 	selector: "app-event-list",
// 	standalone: true,
// 	imports: [CommonModule, FormsModule, EventItemComponent],
// 	templateUrl: "./event-list.component.html",
// })
// export class EventListComponent implements OnInit {
// 	private cardService = inject(EventService);

// 	cards: IEventDto[] = [];
// 	//filteredCards: Card[] = []
// 	searchTerm = "";
// 	currentPage = 1;
// 	itemsPerPage = 8;
// 	totalPages = 0;
// 	categories: string[] = [];
// 	selectedCategory = "All";

// 	ngOnInit(): void {
// 		this.loadCards();
// 	}

// 	loadCards(): void {
// 		this.cardService.getCards().subscribe(cards => {
// 			this.cards = cards;
// 		});
// 	}

// 	getCurrentPageItems(): IEventDto[] {
// 		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
// 		return this.cards.slice(startIndex, startIndex + this.itemsPerPage);
// 	}

// 	onCardSelected(card: IEventDto): void {
// 		console.log("Card selected:", card);
// 		// Handle card selection (e.g., navigate to detail page)
// 	}
// }

@Component({
	selector: "app-event-list",
	standalone: true,
	imports: [FormsModule, EventItemComponent],
	templateUrl: "./event-list.component.html",
})
export class EventListComponent implements OnInit {
	cards: IEventDto[] = [];
	currentPage = 1;
	itemsPerPage = 8;

	constructor(private eventService: EventService) {}

	ngOnInit(): void {
		this.loadEvents();
	}

	loadEvents(): void {
		this.eventService.getEvents().subscribe(events => {
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
