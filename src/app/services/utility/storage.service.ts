import { Injectable } from "@angular/core";

export type StorageType = "local" | "session";

export const storageKeys = {
	newEventForm: "efo.new_event_form",
	preferredTheme: "efo.preferred_theme",
} as const;

export type StorageKeyType = (typeof storageKeys)[keyof typeof storageKeys];

export const defaultStorage: StorageType = "session";

@Injectable({ providedIn: "root" })
export class StorageService {
	private getStorage(type: StorageType): Storage {
		return type === "local" ? localStorage : sessionStorage;
	}

	setItem<T>(
		key: StorageKeyType,
		value: T,
		type: StorageType = defaultStorage
	): void {
		this.getStorage(type).setItem(key, JSON.stringify(value));
	}

	getItem<T>(
		key: StorageKeyType,
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
