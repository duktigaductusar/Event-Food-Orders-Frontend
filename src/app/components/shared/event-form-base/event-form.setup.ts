import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { Observable, takeUntil } from "rxjs";
import { formControllers } from "./constants";
import { environment } from "@environments";
import { IEventDetailOwnerDto } from "@app/models";
import {
	dateValidator,
	timeValidator,
	dateDeadlineValidator,
	timeDeadlineValidator,
	deadlineBeforeEventValidator,
	endTimeValidator,
	dateValidatorFutureDate,
} from "./event-form.validators";
import {
	dateToNgbDateStruct,
	dateToNgbTimeStruct,
	isLessThanOneDayInFuture,
} from "@app/utility";

export function buildCreateEventForm(
	fb: FormBuilder,
	initial?: Partial<IEventDetailOwnerDto>
) {
	return fb.nonNullable.group({
		eventDetailsForm: fb.nonNullable.group(
			{
				title: fb.nonNullable.control(
					initial?.title ?? "",
					Validators.required
				),
				description: fb.nonNullable.control(
					initial?.description ?? "",
					Validators.required
				),
				date: fb.nonNullable.control(
					dateToNgbDateStruct(initial?.date) ?? ({} as NgbDateStruct),
					[
						Validators.required,
						dateValidator,
						dateValidatorFutureDate,
					]
				),
				time: fb.nonNullable.control(
					dateToNgbTimeStruct(initial?.date) ?? ({} as NgbTimeStruct),
					[Validators.required, timeValidator]
				),
				endTime: fb.nonNullable.control(
					dateToNgbTimeStruct(initial?.endTime) ??
						({} as NgbTimeStruct)
				),
				dateDeadline: fb.nonNullable.control(
					dateToNgbDateStruct(initial?.deadline) ??
						({} as NgbDateStruct),
					[
						Validators.required,
						dateDeadlineValidator,
						dateValidatorFutureDate,
					]
				),
				timeDeadline: fb.nonNullable.control(
					dateToNgbTimeStruct(initial?.deadline) ??
						({} as NgbTimeStruct),
					[Validators.required, timeDeadlineValidator]
				),
			},
			{
				validators: [deadlineBeforeEventValidator, endTimeValidator],
			}
		),

		inviteUsersForm: fb.nonNullable.group({
			users: fb.nonNullable.control(initial?.users ?? []),
		}),
	});
}

export function subscribeDateDeadlineToDateChange(
	eventDetailsGroup: FormGroup,
	destroy: Observable<void>
): void {
	eventDetailsGroup
		.get(formControllers.date)
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

			if (!isLessThanOneDayInFuture(deadline)) {
				deadline.setDate(
					deadline.getDate() - environment.defaultDeadline
				);
			}

			const dateDeadline: NgbDateStruct = {
				year: deadline.getFullYear(),
				month: deadline.getMonth() + 1,
				day: deadline.getDate(),
			};

			eventDetailsGroup.patchValue(
				{ dateDeadline },
				{ emitEvent: false } // used to avoid recursion
			);
		});
}

export function subscribeTimeDeadlineToTimeChange(
	eventDetailsGroup: FormGroup,
	destroy: Observable<void>
) {
	eventDetailsGroup
		.get(formControllers.time)
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
				{ emitEvent: false } // used to avoid recursion
			);
		});
}
