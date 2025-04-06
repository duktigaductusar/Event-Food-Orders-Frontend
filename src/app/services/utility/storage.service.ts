import { Injectable } from "@angular/core";

export type StorageType = "local" | "session";

export const storageKeys = {
	newEventForm: "efo.new_event_form",
	updateEventForm: "efo.update_event_form",
	updateEventId: "efo.update_event_id",
	eventResponseForm: "efo.event_response_form",
} as const;

export type StorageKeyType = (typeof storageKeys)[keyof typeof storageKeys];

export const defaultStorage: StorageType = "session";

@Injectable({ providedIn: "root" })
export class StorageService {
	private getStorage(type: StorageType): Storage {
		return type === "local" ? localStorage : sessionStorage;
	}

	setItem<T>(
		key: string,
		value: T,
		type: StorageType = defaultStorage
	): void {
		this.getStorage(type).setItem(key, JSON.stringify(value));
	}

	getItem<T>(
		key: string,
		is: (value: unknown) => value is T,
		type: StorageType = defaultStorage
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

	removeItem(key: string, type: StorageType = defaultStorage): void {
		this.getStorage(type).removeItem(key);
	}
}
