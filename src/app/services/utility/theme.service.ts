import { Injectable, signal } from "@angular/core";
import { storageKeys, StorageService } from "./storage.service";

type ThemeType = "light" | "dark" | "auto";

type ThemeStorageType = ThemeType | null;

@Injectable({ providedIn: "root" })
export class ThemeService {
	private readonly storageType = "local";
	currentTheme = signal<"light" | "dark" | "auto">("auto");

	constructor(private readonly storageService: StorageService) {
		const savedTheme = this.storageService.getItem(
			storageKeys.preferredTheme,
			this.isTheme,
			this.storageType
		);
		this.setTheme(savedTheme ?? "auto");
	}

	isTheme(value: unknown): value is ThemeStorageType {
		return (
			value === "light" ||
			value === "dark" ||
			value === "auton" ||
			value === "null"
		);
	}

	toggleTheme() {
		const next =
			this.currentTheme() === "light" || this.currentTheme() === "auto"
				? "dark"
				: "light";
		this.setTheme(next);
	}

	setTheme(theme: ThemeType) {
		this.currentTheme.set(theme);
		this.storageService.setItem(
			storageKeys.preferredTheme,
			theme,
			this.storageType
		);

		const html = document.documentElement;
		html.removeAttribute("data-bs-theme");

		if (theme === "auto") {
			html.setAttribute("data-bs-theme", "light");
		} else {
			html.setAttribute("data-bs-theme", theme);
		}
	}
}
