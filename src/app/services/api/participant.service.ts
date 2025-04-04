import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
	IParticipantForResponseDto,
	IParticipantForUpdateDto,
} from "@app/models";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ParticipantService {
	private apiUrl = `${environment.apiUrl}/participant`;

	constructor(private http: HttpClient) {}

	respondToEvent(body: Partial<IParticipantForUpdateDto>, id: string) {
		return this.http.put<IParticipantForResponseDto>(
			`${this.apiUrl}/${id}`,
			body
		);
	}

	getParticipantsInEvent(
		eventId: string
	): Observable<IParticipantForResponseDto[]> {
		return this.http.get<IParticipantForResponseDto[]>(
			`${this.apiUrl}/${eventId}/all`
		);
	}
}
