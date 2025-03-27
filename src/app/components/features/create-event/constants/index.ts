import { TranslateService } from "@app/services";

const service = new TranslateService()

export const formTitles = {
	eventDetailTitle: service.t("event-create.detailsForm.title"),
	addUserTitle: service.t("event-create.userForm.title"),
	formVerificationTitle: service.t("event-create.verifyForm.title"),
} as const;
