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

	getEvents(): Observable<IEventDto[]> {
		return this.http.get<IEventDto[]>(`${this.apiUrl}/all`);
	}

	getDetailEvent(participantId:string, userId: string): Observable<IEventDetailDto> {
		return this.http.get<IEventDetailDto>(`${this.apiUrl}/${participantId}?userId=${userId}`);
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

	deleteEvent(eventId: string): Observable<boolean> {
		console.log("Deleting event: ", eventId);
		//return true;
		this.http.delete(`${this.apiUrl}/${eventId}`)
			.pipe(catchError(error => {
				console.error('Error deleting event:', error);
				// TODO CHange to custom Event class instade of empty array
				return of(false);
			}))
		console.log("Event deleted: ", eventId);
		return of(true);
	}
}
