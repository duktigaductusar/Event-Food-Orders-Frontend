import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class LoggerService {
	private storageKey = "DebugLogs";

	log(message: string) {
		const timestamp = new Date().toISOString();
		const logEntry = `${timestamp} - ${message}`;
		console.log(logEntry);
		let logs = localStorage.getItem(this.storageKey);
		logs = logs ? logs + "\n" + logEntry : logEntry;
		localStorage.setItem(this.storageKey, logs);
	}

	getLogs(): string {
		return localStorage.getItem(this.storageKey) || "";
	}

	clearLogs() {
		localStorage.removeItem(this.storageKey);
	}
}
