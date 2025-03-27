import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	Validators,
} from "@angular/forms";
import {
	eventDetailsForm,
	ICreateEventForm,
	inviteUsersForm,
} from "./interfaces";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent } from "@app/components/html";
import { breakpoints } from "@app/components/style";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { formTitles } from "./constants";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { Subject, takeUntil } from "rxjs";

/**
 * TODO:
 * 1) Create Server
 * 		1.1) can be used for reusable methods.
 * 		1.2) For shared state
 * 		1.3) For local/session storage state if needed
 * 2) Update field for adding users, e.g, add show all.
 * 3) Update field for adding end time for event.
 * 4) Connect submit with backend.
 * 		4.1 Match DTO, e.g participant, end time, etc.
 */
@Component({
	selector: "app-create-event",
	standalone: true,
	imports: [
		CommonModule,
		GenericBtnComponent,
		EventDetailsFormComponent,
		EventUserFormComponent,
		VerifyEventFormComponent,
		MultiStepFormHeaderComponent,
		CreateEventFooterContainerComponent,
		CreateEventHeaderContainerComponent,
	],
	templateUrl: "./create-event.component.html",
})
export class CreateEventComponent
	extends AppBaseComponent
	implements OnDestroy, OnInit
{
	step = 1;
	form!: FormGroup<ICreateEventForm>;
	formTitles = formTitles;
	private destroy = new Subject<void>();

	constructor(private fb: FormBuilder) {
		super();
	}

	ngOnInit(): void {
		this.buildForm();
		this.subscribeDateDeadlineToDateChange();
		this.subscribeTimeDeadlineToTimeChange();
	}

	buildForm() {
		this.form = this.fb.nonNullable.group({
			eventDetailsForm: this.fb.nonNullable.group(
				{
					title: this.fb.nonNullable.control("", Validators.required),
					description: this.fb.nonNullable.control(
						"",
						Validators.required
					),
					date: this.fb.nonNullable.control({} as NgbDateStruct, [
						Validators.required,
						this.dateValidator.bind(this),
					]),
					time: this.fb.nonNullable.control({} as NgbTimeStruct, [
						Validators.required,
						this.timeValidator.bind(this),
					]),
					dateDeadline: this.fb.nonNullable.control(
						{} as NgbDateStruct,
						[
							Validators.required,
							this.dateDeadlineValidator.bind(this),
						]
					),
					timeDeadline: this.fb.nonNullable.control(
						{} as NgbTimeStruct,
						[
							Validators.required,
							this.timeDeadlineValidator.bind(this),
						]
					),
				},
				{ validators: this.deadlineBeforeEventValidator.bind(this) }
			),
			inviteUsersForm: this.fb.nonNullable.group({
				emails: this.fb.nonNullable.control([] as string[]),
			}),
		});
	}

	subscribeDateDeadlineToDateChange() {
		const eventDetailsGroup = this.form.get(
			"eventDetailsForm"
		) as FormGroup;

		eventDetailsGroup
			.get("date")
			?.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((selectedDate: NgbDateStruct) => {
				if (
					!selectedDate?.year ||
					!selectedDate?.month ||
					!selectedDate?.day
				)
					return;

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

	subscribeTimeDeadlineToTimeChange() {
		const eventDetailsGroup = this.form.get(
			"eventDetailsForm"
		) as FormGroup;

		eventDetailsGroup
			.get("time")
			?.valueChanges.pipe(takeUntil(this.destroy))
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
					{ emitEvent: false }
				); // avoid recursion
			});
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.form.get(eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.form.get(inviteUsersForm) as FormGroup;
	}

	nextStep() {
		const group = this.getGroupForStep(this.step);
		if (group.invalid) {
			group.markAllAsTouched();
			return;
		}
		this.step++;
	}

	prevStep() {
		this.step--;
	}

	private getGroupForStep(step: number): FormGroup {
		return this.form.get(
			[eventDetailsForm, inviteUsersForm, "verifyForm"][step - 1]
		) as FormGroup;
	}

	dateValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		if (!value || !value.year || !value.month || !value.day) {
			return { invalidDate: true };
		}
		return null;
	}

	timeValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		if (!value || value.hour == null || value.minute == null) {
			return { invalidTime: true };
		}
		return null;
	}

	dateDeadlineValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		if (!value || !value.year || !value.month || !value.day) {
			return { invalidDateDeadline: true };
		}
		return null;
	}

	timeDeadlineValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value;
		if (!value || value.hour == null || value.minute == null) {
			return { invalidTimeDeadline: true };
		}
		return null;
	}

	deadlineBeforeEventValidator(
		group: AbstractControl
	): ValidationErrors | null {
		const date = group.get("date")?.value;
		const time = group.get("time")?.value;
		const deadlineDate = group.get("dateDeadline")?.value;
		const deadlineTime = group.get("timeDeadline")?.value;

		if (!date || !time || !deadlineDate || !deadlineTime) return null;

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
			return { deadlineAfterEvent: true };
		}

		return null;
	}

	getSubFormTitles() {
		return [
			formTitles.eventDetailTitle,
			formTitles.addUserTitle,
			formTitles.formVerificationTitle,
		];
	}

	getDerivedContainerStyle() {
		return { "max-width": `${breakpoints.lg}px` };
	}

	submit = () => {
		if (
			this.form.valid &&
			this.form.value[eventDetailsForm]?.title != null &&
			this.form.value[eventDetailsForm]?.description != null &&
			this.form.value[eventDetailsForm]?.date != null &&
			this.form.value[eventDetailsForm]?.time != null &&
			this.form.value[eventDetailsForm]?.dateDeadline != null &&
			this.form.value[eventDetailsForm]?.timeDeadline != null
		) {
			const dto: IEventForCreationDto = {
				title: this.form.value[eventDetailsForm]?.title,
				description: this.form.value[eventDetailsForm]?.description,
				date: this.toDateTime(
					this.form.value[eventDetailsForm]?.date,
					this.form.value[eventDetailsForm]?.time
				),
				deadline: this.toDateTime(
					this.form.value[eventDetailsForm]?.dateDeadline,
					this.form.value[eventDetailsForm]?.timeDeadline
				),
			};

			console.log("Event create DTO:", dto);
		} else {
			this.form.markAllAsTouched();
		}
	};

	toDateTime = (date: NgbDateStruct, time: NgbTimeStruct) => {
		return new Date(
			date.year,
			date.month - 1,
			date.day,
			time.hour,
			time.minute,
			time.second
		);
	};

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
