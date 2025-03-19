import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService{
    private apiUrl = "http://localhost:3000/api/auth";
    
    constructor(private http: HttpClient, private router: Router) {}
    login(): void {
        window.location.href = `${this.apiUrl}/login`;
    }

    //Probably wont work and probably never gonna be used?
    getAuthStatus(): Promise<any> {
        return this.http.get(`${this.apiUrl}/callback`, {withCredentials: true}).toPromise();
    }

    logout(): void {
        window.location.href = `${this.apiUrl}/logout`;
    }
}