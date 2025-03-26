import { Component } from "@angular/core";
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

/**
 * TODO:
 * 1) Create Server
 * 		1.1) can be used for reusable methods.
 * 		1.2) For shared state
 * 		1.3) For local/session storage state if needed
 * 2) Update Custom Validation of NGB-DATEPICKER and NGB-TEIMEPICKER values
 * 		2.1) Should be valid dates, e.g., not old dates.
 * 		2.2) Deadline must be before event date.
 * 3) Add deadlines input.
 * 4) Update field for adding users, e.g, show all.
 * 5) Convert form date and time to javascript date type when submit.
 * 6) Update submit button to type submit.
 * 7) Update JSON translation files.
 * 8) Connect submit with backend.
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
export class CreateEventComponent {
	step = 1;
	form!: FormGroup<ICreateEventForm>;
	formTitles = formTitles;

	constructor(private fb: FormBuilder) {
		this.form = this.fb.nonNullable.group({
			eventDetailsForm: this.fb.nonNullable.group({
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
			}),
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

	submit = () => {
		if (this.form.valid) {
			console.log("Submitting...");
			console.log(this.form.value);
		} else {
			this.form.markAllAsTouched();
		}
	};
}
