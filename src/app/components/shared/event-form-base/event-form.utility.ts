import { FormGroup } from "@angular/forms";
import { IEventForCreationDto } from "@app/models";
import {
	toDateTimeISOStrig,
	getDateFromNgbTimeAndDateStructs,
} from "@app/utility";
import { formGroups } from "./constants";
import { ICreateEventForm } from "./interfaces";

export function isEventFormData(
	value: unknown
): value is Partial<IEventForCreationDto> {
	if (typeof value !== "object" || value === null) return false;

	const val = value as Partial<IEventForCreationDto>;

	return (
		(val.title === undefined || typeof val.title === "string") &&
		(val.description === undefined ||
			typeof val.description === "string") &&
		(val.date === undefined || typeof val.date === "string") &&
		(val.endTime == null || typeof val.endTime === "string") &&
		(val.deadline === undefined || typeof val.deadline === "string") &&
		(val.userIds === undefined ||
			(Array.isArray(val.userIds) &&
				val.userIds.every(id => typeof id === "string")))
	);
}

export function createEventDtoFromEventForm(
	form: FormGroup<ICreateEventForm>
): IEventForCreationDto | null {
	if (!form.valid) {
		return null;
	}

	return {
		title: form.getRawValue()[formGroups.eventDetailsForm]?.title,
		description:
			form.getRawValue()[formGroups.eventDetailsForm]?.description,
		date: toDateTimeISOStrig(
			form.getRawValue()[formGroups.eventDetailsForm]?.date,
			form.getRawValue()[formGroups.eventDetailsForm]?.time
		),
		endTime:
			getDateFromNgbTimeAndDateStructs(
				form.getRawValue()[formGroups.eventDetailsForm]?.date,
				form.getRawValue()[formGroups.eventDetailsForm]?.endTime
			)?.toISOString() ?? null,
		deadline: toDateTimeISOStrig(
			form.getRawValue()[formGroups.eventDetailsForm]?.dateDeadline,
			form.getRawValue()[formGroups.eventDetailsForm]?.timeDeadline
		),
		userIds:
			form.value[formGroups.inviteUsersForm]?.users?.map(p => p.userId) ??
			[],
	};
}
