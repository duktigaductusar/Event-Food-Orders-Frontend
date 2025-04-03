import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUserDto, IUserIdsDto } from "@app/models";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private apiUrl = `${environment.apiUrl}/user`;

	constructor(private http: HttpClient) {}

	getUsers(queryString: string): Observable<IUserDto[]> {
		return this.http.get<IUserDto[]>(`${this.apiUrl}`, {
			params: { queryString },
		});
	}

	getUsersFromId(userIdsAsStringArray: string[]): Observable<IUserDto[]> {
		const body: IUserIdsDto = {
			userIds: userIdsAsStringArray,
		};
		return this.http.post<IUserDto[]>(`${this.apiUrl}/userId`, body);
	}
}
