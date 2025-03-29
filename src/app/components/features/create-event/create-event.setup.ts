import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { Observable, takeUntil } from "rxjs";
import {
	date,
	eventDetailsForm,
	inviteUsersForm,
	time,
} from "./constants";
import { environment } from "@environments";
import { ICreateEventForm } from "./interfaces";
import { IUserDto } from "@app/models";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { dateValidator, timeValidator, dateDeadlineValidator, timeDeadlineValidator, deadlineBeforeEventValidator, endTimeValidator, dateValidatorFutureDate } from "./create-event.validators";
import { toDateTimeISOStrig, getEndDate } from "./create-event.utils";

export function buildCreatEventForm(fb: FormBuilder) {
	return fb.nonNullable.group({
		eventDetailsForm: fb.nonNullable.group(
			{
				title: fb.nonNullable.control("", Validators.required),
				description: fb.nonNullable.control(
					"",
					Validators.required
				),
				date: fb.nonNullable.control({} as NgbDateStruct, [
					Validators.required,
					dateValidator,
					dateValidatorFutureDate
				]),
				time: fb.nonNullable.control({} as NgbTimeStruct, [
					Validators.required,
					timeValidator,
				]),
				endTime: fb.nonNullable.control(
					{} as NgbTimeStruct,
					[]
				),
				dateDeadline: fb.nonNullable.control(
					{} as NgbDateStruct,
					[Validators.required, dateDeadlineValidator]
				),
				timeDeadline: fb.nonNullable.control(
					{} as NgbTimeStruct,
					[Validators.required, timeDeadlineValidator]
				),
			},
			{ validators: [deadlineBeforeEventValidator, endTimeValidator] }
		),
		inviteUsersForm: fb.nonNullable.group({
			users: fb.nonNullable.control([] as IUserDto[]),
		}),
	});
}

export function createEventDtoFromCreateEventForm(form: FormGroup<ICreateEventForm>) {
	if (
		form.valid &&
		form.value[eventDetailsForm]?.title != null &&
		form.value[eventDetailsForm]?.description != null &&
		form.value[eventDetailsForm]?.date != null &&
		form.value[eventDetailsForm]?.time != null &&
		form.value[eventDetailsForm]?.dateDeadline != null &&
		form.value[eventDetailsForm]?.timeDeadline != null
	) {
		const dto: IEventForCreationDto = {
			title: form.value[eventDetailsForm]?.title,
			description: form.value[eventDetailsForm]?.description,
			date: toDateTimeISOStrig(
				form.value[eventDetailsForm]?.date,
				form.value[eventDetailsForm]?.time
			),
			endTime: getEndDate(
				form.value[eventDetailsForm]?.date,
				form.value[eventDetailsForm]?.endTime
			)?.toISOString() ?? null,
			deadline: toDateTimeISOStrig(
				form.value[eventDetailsForm]?.dateDeadline,
				form.value[eventDetailsForm]?.timeDeadline
			),
			userIds: form.value[inviteUsersForm]?.users?.map(p => p.userId) ?? [],
		}

		return dto
	} else {
		return null
	}
}

export function subscribeDateDeadlineToDateChange(
	eventDetailsGroup: FormGroup,
	destroy: Observable<void>
): void {
	eventDetailsGroup
		.get(date)
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

			// TODO Set default_deadline as environment variable.
			deadline.setDate(deadline.getDate() - environment.defaultDeadline);

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
		.get(time)
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
