import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";
import { IEventDetailDto } from "@app/models/IEventDetailDto.model";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { environment } from "@environments";
import type { Observable } from "rxjs";

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

	getDetailEvent(
		participantId: string,
		userId: string
	): Observable<IEventDetailDto> {
		return this.http.get<IEventDetailDto>(
			`${this.apiUrl}/${participantId}?userId=${userId}`
		);
	}

	createEvent(body: IEventForCreationDto): Observable<IEventDto> {
		return this.http.post<IEventDto>(this.apiUrl, body);
	}

	deleteEvent(eventId: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.apiUrl}/${eventId}`);
	}
}
