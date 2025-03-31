import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUserDto } from "@app/models";
import { environment } from "@environments/environment";
import { Observable, catchError, of } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private apiUrl = `${environment.apiUrl}/user`;

	constructor(private http: HttpClient) { }

	getUsers(queryString: string): Observable<IUserDto[]> {
		return this.http.get<IUserDto[]>(`${this.apiUrl}`, {
			params: { queryString }
		}).pipe(
			catchError(error => {
				console.error('Error fetching users:', error);
				// TODO CHange to custom Event class instade of empty array
				return of([]);
			})
		);
	}
}