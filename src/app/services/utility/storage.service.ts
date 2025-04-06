import { Injectable } from "@angular/core";

export type StorageType = "local" | "session";

export const storageKeys = {
	newEventForm: "new_event_form",
	updateEventForm: "update_event_form",
	updateEventId: "update_event_id",
	eventResponseForm: "event_response_form",
} as const;

export type StorageKeyType = (typeof storageKeys)[keyof typeof storageKeys];

@Injectable({ providedIn: "root" })
export class StorageService {
	private getStorage(type: StorageType): Storage {
		return type === "local" ? localStorage : sessionStorage;
	}

	setItem<T>(key: string, value: T, type: StorageType = "local"): void {
		this.getStorage(type).setItem(key, JSON.stringify(value));
	}

	getItem<T>(
		key: string,
		is: (value: unknown) => value is T,
		type: StorageType = "local"
	): T | null {
		const raw = this.getStorage(type).getItem(key);
		if (!raw) return null;
		try {
			const parsed = JSON.parse(raw);
			return is(parsed) ? parsed : null;
		} catch {
			return null;
		}
	}

	removeItem(key: string, type: StorageType = "local"): void {
		this.getStorage(type).removeItem(key);
	}
}
