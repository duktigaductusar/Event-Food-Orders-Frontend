import { inject } from "@angular/core";
import { TranslationKeyPaths } from "@types";
import { TranslateService } from "@app/services";
import i18next, { TOptions } from "i18next";

export class AppBaseComponent {
	protected translationService = inject(TranslateService);

	t(key: TranslationKeyPaths): string {
		return this.translationService.t(key);
	}

	t2(key: TranslationKeyPaths, obj: TOptions): string {
		return i18next.t(key, obj);
	}
}
