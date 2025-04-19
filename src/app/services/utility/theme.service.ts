import { Injectable, signal } from "@angular/core";

const STORAGE_KEY = "efo.preferred_theme";

type ThemeType = "light" | "dark" | "auto";

type ThemeTypeStorage = ThemeType | null;

@Injectable({ providedIn: "root" })
export class ThemeService {
	currentTheme = signal<"light" | "dark" | "auto">("auto");

	constructor() {
		const savedTheme = localStorage.getItem(
			STORAGE_KEY
		) as ThemeTypeStorage;
		this.setTheme(savedTheme ?? "auto");
	}

	toggleTheme() {
		const next = this.currentTheme() === "light" ? "dark" : "light";
		this.setTheme(next);
	}

	setTheme(theme: ThemeType) {
		this.currentTheme.set(theme);
		localStorage.setItem(STORAGE_KEY, theme);

		const html = document.documentElement;
		html.removeAttribute("data-bs-theme");

		if (theme === "auto") {
			html.setAttribute("data-bs-theme", "light");
		} else {
			html.setAttribute("data-bs-theme", theme);
		}
	}
}
