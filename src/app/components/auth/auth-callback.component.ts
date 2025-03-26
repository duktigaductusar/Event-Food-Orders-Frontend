import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppBaseComponent } from "../base/app-base.component";
import { lastValueFrom, firstValueFrom } from "rxjs";

@Component({
    selector: "app-auth-callback",
    standalone: true,
    template: "<p>Finalizing Login, please wait...</p>"
})
export class AuthCallbackComponent extends AppBaseComponent implements OnInit{
    constructor(private msalService: MsalService, private httpClient: HttpClient, private router: Router){
        super()
    }

    async ngOnInit(): Promise<void>{
        console.log("Callback component starting.");
        try {
            const account = this.msalService.instance.getActiveAccount();
            if (account) {
                const tokenResponse = await lastValueFrom(this.msalService.acquireTokenSilent({
                    scopes: ["openid", "profile", "email", "https://graph.microsoft.com/.default"]
                }));
                const token = tokenResponse.accessToken;
                await firstValueFrom(this.httpClient.post("http://localhost:8080/api/Auth/bounce", {token})); //ToDo - Make dynamic
                console.log("Callback component done logging in. Redirecting to Home.");
            }
        }catch (error) {
            console.error("Token exchange error: ", error);
        }finally {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.router.navigate(["/"]);
        }
    }
}
