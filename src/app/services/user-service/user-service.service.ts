import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEventDto } from '@app/models';
import { environment } from '@environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = `${environment.apiUrl}/user`;
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getUsers(queryString: string): Observable<IEventDto[]> {
    return this.http.get<IEventDto[]>(`${this.apiUrl}?queryString=${queryString}`);
  }
}
