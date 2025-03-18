import { inject } from "@angular/core";
import { TranslationKeyPaths } from "@types";

import { TranslateService } from "@app/services";

export class AppBaseComponent {
	protected translationService = inject(TranslateService);

	t(key: TranslationKeyPaths): string {
		return this.translationService.t(key);
	}
}
