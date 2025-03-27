import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { Observable, takeUntil } from "rxjs";
import {
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
	const date = group.get("date")?.value;
	const time = group.get("time")?.value;
	const endTime = group.get("endTime")?.value;

	if (!date || !time) {
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
	const date = group.get("date")?.value;
	const time = group.get("time")?.value;
	const deadlineDate = group.get("dateDeadline")?.value;
	const deadlineTime = group.get("timeDeadline")?.value;

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

	if (deadline >= event) {
		return { [eventDetailsValidationGroupKeys.deadlineAfterEvent]: true };
	}

	return null;
}

export function subscribeDateDeadlineToDateChange(
	eventDetailsGroup: FormGroup,
	destroy: Observable<void>
): void {
	eventDetailsGroup
		.get("date")
		?.valueChanges.pipe(takeUntil(destroy))
		.subscribe((selectedDate: NgbDateStruct) => {
			if (
				!selectedDate?.year ||
				!selectedDate?.month ||
				!selectedDate?.day
			) {
				return;
			}

			const deadline = new Date(
				selectedDate.year,
				selectedDate.month - 1,
				selectedDate.day
			);
			deadline.setDate(deadline.getDate() - 1);

			const dateDeadline: NgbDateStruct = {
				year: deadline.getFullYear(),
				month: deadline.getMonth() + 1,
				day: deadline.getDate(),
			};

			eventDetailsGroup.patchValue(
				{ dateDeadline },
				{ emitEvent: false } // avoid recursion
			);
		});
}

export function subscribeTimeDeadlineToTimeChange(
	eventDetailsGroup: FormGroup,
	destroy: Observable<void>
) {
	eventDetailsGroup
		.get("time")
		?.valueChanges.pipe(takeUntil(destroy))
		.subscribe((selectedTime: NgbTimeStruct) => {
			if (selectedTime?.hour == null || selectedTime?.minute == null)
				return;

			const timeDeadline: NgbTimeStruct = {
				hour: selectedTime.hour,
				minute: selectedTime.minute,
				second: selectedTime.second ?? 0,
			};

			eventDetailsGroup.patchValue(
				{ timeDeadline },
				{ emitEvent: false } // avoid recursion
			);
		});
}
