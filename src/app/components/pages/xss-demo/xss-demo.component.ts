import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
	selector: "app-xss-demo",
	templateUrl: "./xss-demo.component.html",
	imports: [CommonModule, FormsModule],
})
export class XssDemoComponent {
	attackPayload = `<img src=x onerror="alert('XSS from Angular innerHTML')">`;
	attackStorage = `<img src=x onerror="alert('XSS: I can access sessionStorage'); console.log('Session Storage Dump:', sessionStorage)">`;
	unsafeOutput: SafeHtml | null = null;
	safeOutput = "";

	constructor(private sanitizer: DomSanitizer) {}

	// Unsafe output shows how innerHTML can be abused
	runAttack() {
		this.unsafeOutput = this.sanitizer.bypassSecurityTrustHtml(
			this.attackStorage
		);
	}

	// Safe output using Angular's default escaping
	runSafe() {
		this.safeOutput = this.attackPayload;
	}
}
