import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";
import { IEventDetailDto } from "@app/models/IEventDetailDto.model";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { environment } from "@environments";
import { catchError, type Observable, of } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class EventService {
	private apiUrl = `${environment.apiUrl}/event`;
	private http: HttpClient;

	selectedEventDto = signal<IEventDto | null>(null);

	constructor(http: HttpClient) {
		this.http = http;
	}

	setSelectedEvent(item: IEventDto) {
		this.selectedEventDto.set(item);
	}

	private eventDetail: IEventDetailDto = {
		id: "1",
		title: "Business Meeting",
		description: "Quarterly review with stakeholders",
		date: new Date("2024-07-15"),
		isOwner: false,
		responseType: "PENDING",
		deadline: new Date("2025-08-12"),
		participantID: "3",
		wantsMeal: true,
		allergies: ["vego"],
		preferences: ["testpreferences"],
	};

	getEvents(): Observable<IEventDto[]> {
		return this.http.get<IEventDto[]>(`${this.apiUrl}/all`);
	}

	getDetailEvent(): Observable<IEventDetailDto> {
		return of(this.eventDetail);
	}

	createEvent(body: IEventForCreationDto) {
		return this.http.post<IEventDto>(`${this.apiUrl}`, body, {
			headers: { 'Content-Type': 'application/json' }
		  })
			.pipe(catchError(error => {
				console.error('Error fetching users:', error);
				// TODO CHange to custom Event class instade of empty array
				return of([]);
			}));
	}

	// getEventById(id: string): Observable<IEventDto | undefined> {
	// 	return of(this.events.find(event => event.id === id));
	// }
}
