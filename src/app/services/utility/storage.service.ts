import { Injectable } from "@angular/core";

export type StorageType = "local" | "session";

export type StorageKeyType =
	| "NEW_EVENT_FORM"
	| "UPDATE_EVENT_FORM"
	| "EVENT_RESPONSE_FORM";

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

	clear(type: StorageType = "local"): void {
		this.getStorage(type).clear();
	}
}
