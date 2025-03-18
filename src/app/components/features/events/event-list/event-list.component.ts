import { Component, type OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EventItemComponent } from "../event-item/event-item.component";
import { IEventDto } from "@app/models";
import { EventService } from "@app/services";

@Component({
	selector: "app-event-list",
	standalone: true,
	imports: [CommonModule, FormsModule, EventItemComponent],
	templateUrl: "./event-list.component.html",
})
export class EventListComponent implements OnInit {
	private cardService = inject(EventService);

	cards: IEventDto[] = [];
	//filteredCards: Card[] = []
	searchTerm = "";
	currentPage = 1;
	itemsPerPage = 8;
	totalPages = 0;
	categories: string[] = [];
	selectedCategory = "All";

	ngOnInit(): void {
		this.loadCards();
	}

	loadCards(): void {
		this.cardService.getCards().subscribe(cards => {
			this.cards = cards;
		});
	}

	getCurrentPageItems(): IEventDto[] {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		return this.cards.slice(startIndex, startIndex + this.itemsPerPage);
	}

	onCardSelected(card: IEventDto): void {
		console.log("Card selected:", card);
		// Handle card selection (e.g., navigate to detail page)
	}
}
