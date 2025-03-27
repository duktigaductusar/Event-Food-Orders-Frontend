import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import {
	FormBuilder,
	FormGroup,
	Validators,
} from "@angular/forms";
import { dateValidator, timeValidator, dateDeadlineValidator, timeDeadlineValidator, deadlineBeforeEventValidator, subscribeDateDeadlineToDateChange, subscribeTimeDeadlineToTimeChange, endTimeValidator } from "./create-event.utils";
import { Subject } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent } from "@app/components/html";
import { breakpoints } from "@app/components/style";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { eventDetailsForm, formTitles, inviteUsersForm } from "./constants";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";


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
 * 5) Create constans or something other scalable mehanism for
 * 		5.1) Angular formControllerName attributes
 * 		5.2) Angular validation keys.
 * 6) Replace mock participant mails and ids with data from backend.
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
	implements OnDestroy, OnInit {
	step = 1;
	form!: FormGroup<ICreateEventForm>;
	formTitles = formTitles;
	private destroy = new Subject<void>();

	constructor(private fb: FormBuilder) {
		super();
	}

	ngOnInit(): void {
		this.buildForm();
		const eventDetailsGroup = this.form.get(
			"eventDetailsForm"
		) as FormGroup;
		subscribeDateDeadlineToDateChange(eventDetailsGroup, this.destroy);
		subscribeTimeDeadlineToTimeChange(eventDetailsGroup, this.destroy);
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
						dateValidator,
					]),
					time: this.fb.nonNullable.control({} as NgbTimeStruct, [
						Validators.required,
						timeValidator,
					]),
					endTime: this.fb.nonNullable.control({} as NgbTimeStruct, []),
					dateDeadline: this.fb.nonNullable.control(
						{} as NgbDateStruct,
						[
							Validators.required,
							dateDeadlineValidator,
						]
					),
					timeDeadline: this.fb.nonNullable.control(
						{} as NgbTimeStruct,
						[
							Validators.required,
							timeDeadlineValidator,
						]
					),
				},
				{ validators: [deadlineBeforeEventValidator, endTimeValidator] }
			),
			inviteUsersForm: this.fb.nonNullable.group({
				emails: this.fb.nonNullable.control([] as string[]),
			}),
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
				endTime: this.getEndDate(
					this.form.value[eventDetailsForm]?.date,
					this.form.value[eventDetailsForm]?.endTime
				),
				deadline: this.toDateTime(
					this.form.value[eventDetailsForm]?.dateDeadline,
					this.form.value[eventDetailsForm]?.timeDeadline
				),
				participants: this.generateRandomParticpantsIDSFromMails(this.form.value[inviteUsersForm]?.emails ?? [])
			};

			console.log("Event create DTO:", dto);
		} else {
			this.form.markAllAsTouched();
		}
	};

	generateRandomParticpantsIDSFromMails(mails: string[]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return mails.map(_ => this.generateGUID())
	}

	generateGUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		  const r = (Math.random() * 16) | 0;
		  const v = c === 'x' ? r : (r & 0x3) | 0x8;
		  return v.toString(16);
		});
	}

	getEndDate = (date?: NgbDateStruct, time?: NgbTimeStruct) => {
		if (date == null || time?.hour ==  null || time?.minute ==  null) {
			return null;
		}

		return new Date(
			date.year,
			date.month - 1,
			date.day,
			time.hour,
			time.minute,
			time.second
		);
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
