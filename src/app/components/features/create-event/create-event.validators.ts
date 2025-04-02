import { AbstractControl, ValidationErrors } from "@angular/forms";
import {
	eventDetailsControllerNames,
	eventDetailsValidationGroupKeys,
	eventDetailsValidationKeys,
} from "./constants";

export function dateValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = control.value;
	if (!value || !value.year || !value.month || !value.day) {
		return { [eventDetailsValidationKeys.invalidDate]: true };
	}
	return null;
}

export function dateValidatorFutureDate(
	control: AbstractControl
): ValidationErrors | null {
	const value = control.value;

	if (!value || !value.year || !value.month || !value.day) {
		return { [eventDetailsValidationKeys.invalidDateFutureDate]: true };
	}

	const selectedDate = new Date(value.year, value.month - 1, value.day);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	if (selectedDate < tomorrow) {
		return { [eventDetailsValidationKeys.invalidDateFutureDate]: true };
	}

	return null;
}

export function timeValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = control.value;
	if (!value || value.hour == null || value.minute == null) {
		return { [eventDetailsValidationKeys.invalidTime]: true };
	}
	return null;
}

export function endTimeValidator(
	group: AbstractControl
): ValidationErrors | null {
	const date = group.get(eventDetailsControllerNames.date)?.value;
	const time = group.get(eventDetailsControllerNames.time)?.value;
	const endTime = group.get(eventDetailsControllerNames.endTime)?.value;

	if (!date || !time || !endTime) {
		return null;
	}

	const event = new Date(
		date.year,
		date.month - 1,
		date.day,
		time.hour,
		time.minute
	);

	const eventEnd = new Date(
		date.year,
		date.month - 1,
		date.day,
		endTime.hour,
		endTime.minute
	);

	if (eventEnd < event) {
		return { [eventDetailsValidationGroupKeys.eventEndBeforeStart]: true };
	}

	return null;
}

export function dateDeadlineValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = control.value;
	if (!value || !value.year || !value.month || !value.day) {
		return { [eventDetailsValidationKeys.invalidDateDeadline]: true };
	}
	return null;
}

export function timeDeadlineValidator(
	control: AbstractControl
): ValidationErrors | null {
	const value = control.value;
	if (!value || value.hour == null || value.minute == null) {
		return { [eventDetailsValidationKeys.invalidTimeDeadline]: true };
	}
	return null;
}

export function deadlineBeforeEventValidator(
	group: AbstractControl
): ValidationErrors | null {
	const date = group.get(eventDetailsControllerNames.date)?.value;
	const time = group.get(eventDetailsControllerNames.time)?.value;
	const deadlineDate = group.get(
		eventDetailsControllerNames.dateDeadline
	)?.value;
	const deadlineTime = group.get(
		eventDetailsControllerNames.timeDeadline
	)?.value;

	if (!date || !time || !deadlineDate || !deadlineTime) {
		return null;
	}

	const event = new Date(
		date.year,
		date.month - 1,
		date.day,
		time.hour,
		time.minute
	);
	const deadline = new Date(
		deadlineDate.year,
		deadlineDate.month - 1,
		deadlineDate.day,
		deadlineTime.hour,
		deadlineTime.minute
	);

	if (deadline > event) {
		return { [eventDetailsValidationGroupKeys.deadlineAfterEvent]: true };
	}

	return null;
}
