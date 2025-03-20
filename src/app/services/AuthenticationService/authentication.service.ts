import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService{
    private apiUrl = "http://localhost:8080/api/Authorization";
    
    constructor(private http: HttpClient) {
        console.log("AuthService initialized");
    }

    login(): void {
        window.location.href = `${this.apiUrl}/login`;
    }

    logout(): void {
        window.location.href = `${this.apiUrl}/logout`;
    }
}