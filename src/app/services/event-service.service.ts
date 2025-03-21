import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";
import { environment } from "@environments/environment.development";
import { type Observable, of } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class EventService {
	private apiUrl = `${environment.apiUrl}/event`;
	private http: HttpClient;

	currentSelectedEventDto = signal <IEventDto | null>(null);

	constructor(http: HttpClient) {
		this.http = http;
	}

	setCurrentSelectedEvent(item:IEventDto){
		this.currentSelectedEventDto.set(item)
	}

	private cards: IEventDto[] = [
		{
			id: 1,
			title: "Business Meeting",
			description: "Quarterly review with stakeholders",
			date: new Date("2024-07-15"),
			isOwner: false,
			response: "PENDING",
			wantsMeal: false,
		},
		{
			id: 2,
			title: "Team Lunch",
			description: "Casual lunch with the development team",
			date: new Date("2024-07-20"),
			isOwner: true,
			response: "ATTENDING_OFFICE",
			wantsMeal: true,
		},
		{
			id: 3,
			title: "Product Launch",
			description: "New product line introduction to the market",
			date: new Date("2024-08-05"),
			isOwner: false,
			response: "NOT_ATTENDING",
			wantsMeal: false,
		},
		{
			id: 4,
			title: "Training Workshop",
			description: "Technical training for new software tools",
			date: new Date("2024-08-12"),
			isOwner: false,
			response: "ATTENDING_ONLINE",
			wantsMeal: false,
		},
	];

	getEvents(): Observable<IEventDto[]> {
		return of(this.cards);
		// return this.http.get<IEventDto[]>(`${this.apiUrl}/get/all`)
	}

	getEventById(id: number): Observable<IEventDto | undefined> {
		return of(this.cards.find(event => event.id === id));
	}

	updateEventResponse(
		id: number,
		newResponse:
			| "PENDING"
			| "ATTENDING_ONLINE"
			| "ATTENDING_OFFICE"
			| "NOT_ATTENDING"
	): void {
		const event = this.cards.find(event => event.id === id);
		if (event) {
			event.response = newResponse;
		}
	}
}
