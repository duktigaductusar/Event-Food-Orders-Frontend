import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AuthenticationService {
	private apiUrl = "http://localhost:8080/api/Authorization";

	login(): void {
		window.location.href = `${this.apiUrl}/protected`;
	}

	logout(): void {
		window.location.href = `${this.apiUrl}/logout`;
	}
}
