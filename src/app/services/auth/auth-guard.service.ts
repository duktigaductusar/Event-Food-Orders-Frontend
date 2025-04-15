import { Injectable } from "@angular/core";
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		const targetUrl = state.url;

		const account = this.authService.getActiveAccountUserId();
		const accounts = this.authService.getAllAccounts();

		if (account != null && accounts.length > 0) {
			return true;
		}

		this.authService.login(targetUrl);
		return false;
	}
}
