import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IParticipantForResponseDto, IParticipantForUpdateDto } from '@app/models';
import { environment } from '@environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private apiUrl = `${environment.apiUrl}/participant`;

	constructor(private http: HttpClient) { }

  respondToEvent(body: Partial<IParticipantForUpdateDto>, id:string) {
    return this.http.put<IParticipantForResponseDto>(`${this.apiUrl}/${id}`, body, {
      headers: { 'Content-Type': 'application/json' }
      })
      .pipe(catchError(error => {
        console.error('Error fetching users:', error);
        // TODO CHange to custom Event class instade of empty array
        return of([]);
      }));
  }


}
