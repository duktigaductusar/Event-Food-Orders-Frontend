import { Injectable, signal } from "@angular/core";

const STORAGE_KEY = "efo.preferred_theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
	currentTheme = signal<"light" | "dark" | "auto">("auto");

	constructor() {
		const savedTheme = localStorage.getItem(STORAGE_KEY) as
			| "light"
			| "dark"
			| "auto"
			| null;
		this.setTheme(savedTheme ?? "auto");
	}

	toggleTheme() {
		const next = this.currentTheme() === "light" ? "dark" : "light";
		this.setTheme(next);
	}

	setTheme(theme: "light" | "dark" | "auto") {
		this.currentTheme.set(theme);
		localStorage.setItem(STORAGE_KEY, theme);

		const html = document.documentElement;
		html.removeAttribute("data-bs-theme");

		if (theme === "auto") {
			html.setAttribute(
				"data-bs-theme",
				window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
			);
		} else {
			html.setAttribute("data-bs-theme", theme);
		}
	}
}
