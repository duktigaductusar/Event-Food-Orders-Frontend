import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
	dateValidator,
	timeValidator,
	dateDeadlineValidator,
	timeDeadlineValidator,
	deadlineBeforeEventValidator,
	subscribeDateDeadlineToDateChange,
	subscribeTimeDeadlineToTimeChange,
	endTimeValidator,
} from "./create-event.utils";
import { Subject } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent, NgbdModalBasic } from "@app/components/html";
import { breakpoints } from "@app/components/style";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { IEventForCreationDto } from "@app/models/IEventForCreationDto";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { eventDetailsForm, formTitles, inviteUsersForm } from "./constants";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";
import { IUserDto } from "@app/models";
import { EventService } from "@app/services";

/**
 * TODO:
 * 1) Create Server
 * 		1.1) For shared state
 * 		1.2) For local/session storage state if needed
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
		NgbdModalBasic
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
	isPending = signal(false);

	constructor(private fb: FormBuilder, private service: EventService) {
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
					endTime: this.fb.nonNullable.control(
						{} as NgbTimeStruct,
						[]
					),
					dateDeadline: this.fb.nonNullable.control(
						{} as NgbDateStruct,
						[Validators.required, dateDeadlineValidator]
					),
					timeDeadline: this.fb.nonNullable.control(
						{} as NgbTimeStruct,
						[Validators.required, timeDeadlineValidator]
					),
				},
				{ validators: [deadlineBeforeEventValidator, endTimeValidator] }
			),
			inviteUsersForm: this.fb.nonNullable.group({
				users: this.fb.nonNullable.control([] as IUserDto[]),
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
				date: this.toDateTimeISOStrig(
					this.form.value[eventDetailsForm]?.date,
					this.form.value[eventDetailsForm]?.time
				),
				endTime: this.getEndDate(
					this.form.value[eventDetailsForm]?.date,
					this.form.value[eventDetailsForm]?.endTime
				)?.toISOString() ?? null,
				deadline: this.toDateTimeISOStrig(
					this.form.value[eventDetailsForm]?.dateDeadline,
					this.form.value[eventDetailsForm]?.timeDeadline
				),
				userIds: this.form.value[inviteUsersForm]?.users?.map(p => p.userId) ?? [],
			};
			this.isPending.set(true);
			this.service.createEvent(dto).subscribe({
				next: event => {
					console.log('created event: ', event);
				},
				error: error => {
					console.error("Error fetching users:", error);
				},
				complete: () => this.isPending.set(false),
			});

		} else {
			this.form.markAllAsTouched();
		}
	};

	getEndDate = (date?: NgbDateStruct, time?: NgbTimeStruct) => {
		if (date == null || time?.hour == null || time?.minute == null) {
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

	toDateTimeISOStrig = (date: NgbDateStruct, time: NgbTimeStruct) => {
		return new Date(
			date.year,
			date.month - 1,
			date.day,
			time.hour,
			time.minute,
			time.second
		).toISOString();
	};

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
