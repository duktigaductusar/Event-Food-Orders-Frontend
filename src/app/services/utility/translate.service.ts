import { Injectable } from "@angular/core";
import { language } from "@app/constants/language";
import i18next, { type TOptions } from "i18next";
import sv from "@assets/i18n/sv/sv.json";
import { TranslationKeyPaths } from "@types";

const defaultNS = "translation";

const resources = {
	sv: { translation: { ...sv } },
} as const;

@Injectable({
	providedIn: "root",
})
export class TranslateService {
	constructor() {
		i18next.init({
			lng: language.SV,
			fallbackLng: language.SV,
			resources,
			defaultNS,
		});
	}

	t(key: TranslationKeyPaths): string {
		return i18next.t(key);
	}

	t2(key: TranslationKeyPaths, obj: TOptions): string {
		return i18next.t(key, obj);
	}
}
