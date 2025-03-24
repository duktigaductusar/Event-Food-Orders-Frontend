import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";
import { IEventDetailDto } from "@app/models/IEventDetailDto.model";
import { environment } from "@environments/environment.development";
import { type Observable, of } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class EventService {
	private apiUrl = `${environment.apiUrl}/event`;
	private http: HttpClient;

	selectedEventDto = signal<IEventDto | null>(null);
	selectedEventDetailDto = signal<IEventDetailDto | null>(null);

	constructor(http: HttpClient) {
		this.http = http;
	}

	setSelectedEvent(item: IEventDto) {
		this.selectedEventDto.set(item);
	}

	private events: IEventDto[] = [
		{
			id: "1",
			title: "Business Meeting",
			description: "Quarterly review with stakeholders",
			date: new Date("2024-07-15"),
			isOwner: false,
			responseType: "PENDING",			
		},
		{
			id: "2",
			title: "Team Lunch",
			description: "Casual lunch with the development team",
			date: new Date("2024-07-20"),
			isOwner: true,
			responseType: "ATTENDING_OFFICE",			
		},
		{
			id: "3",
			title: "Product Launch",
			description: "New product line introduction to the market",
			date: new Date("2024-08-05"),
			isOwner: false,
			responseType: "NOT_ATTENDING",
		},
		{
			id: "4",
			title: "Training Workshop",
			description: "Technical training for new software tools",
			date: new Date("2024-08-12"),
			isOwner: false,
			responseType: "ATTENDING_ONLINE",
		},
	];

	private eventDetail: IEventDetailDto = 
		{
			id: "1",
			title: "Business Meeting",
			description: "Quarterly review with stakeholders",
			date: new Date("2024-07-15"),
			isOwner: false,
			responseType: "PENDING",
			deadline: new Date("2025-08-12"),
			participantID: "3",
			wantsMeal:true,
			allergies: ["vego"],
			preferences: ["testpreferences"]			
		};

	getEvents(): Observable<IEventDto[]> {
		// return of(this.events);
		return this.http.get<IEventDto[]>(`${this.apiUrl}/all`)
	}

	getDetailEvent(): Observable<IEventDetailDto> {
		return of(this.eventDetail);
		// return this.http.get<IEventDto[]>(`${this.apiUrl}/get/all`)
	}

	getEventById(id: string): Observable<IEventDto | undefined> {
		return of(this.events.find(event => event.id === id));
	}

	updateEventResponse(
		id: string,
		newResponse:
			| "PENDING"
			| "ATTENDING_ONLINE"
			| "ATTENDING_OFFICE"
			| "NOT_ATTENDING"
	): void {
		const event = this.events.find(event => event.id === id);
		if (event) {
			event.responseType = newResponse;
		}
	}
}
