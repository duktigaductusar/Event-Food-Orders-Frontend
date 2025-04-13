import { Injectable } from "@angular/core";
import { MsalService } from "@azure/msal-angular";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	constructor(private msalService: MsalService) {}

	getActiveAcoountUserId(): string | undefined {
		const account = this.msalService.instance.getActiveAccount();
		return account?.idTokenClaims?.oid;
	}
}
