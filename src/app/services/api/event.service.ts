import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IEventDto, IEventForUpdateDto } from "@app/models";
import { IEventDetailDto } from "@app/models/eventDtos/IEventDetailDto.model";
import { IEventDetailInfoDto } from "@app/models/eventDtos/IEventDetailInfoDto.model";
import { IEventForCreationDto } from "@app/models/eventDtos/IEventForCreationDto";
import { environment } from "@environments";
import type { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class EventService {
	private apiUrl = `${environment.apiUrl}/event`;
	private http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	getEvents(): Observable<IEventDto[]> {
		return this.http.get<IEventDto[]>(`${this.apiUrl}/all`);
	}

	getDetailEvent(eventId: string): Observable<IEventDetailDto> {
		return this.http.get<IEventDetailDto>(`${this.apiUrl}/${eventId}`);
	}

	getDetailInfoEvent(eventId: string): Observable<IEventDetailInfoDto> {
		return this.http.get<IEventDetailInfoDto>(
			`${this.apiUrl}/${eventId}/info`
		);
	}

	createEvent(body: IEventForCreationDto): Observable<IEventDto> {
		return this.http.post<IEventDto>(this.apiUrl, body);
	}

	deleteEvent(eventId: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.apiUrl}/${eventId}`);
	}

	updateEvent(
		eventId: string,
		body: IEventForUpdateDto
	): Observable<IEventDto> {
		return this.http.put<IEventDto>(`${this.apiUrl}/${eventId}`, body);
	}
}
