import { Component } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { eventDetailsForm, ICreateEventForm, inviteUsersForm, verifyForm } from "./interfaces";
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
 * 1) Create Server for reusable methods.
 * 2) Use hidden input fields to be able to validate date and time. 
 * 3) Add deadlines
 * 4) Convert form date and time to javascript date type.
 * 5) Update submit button to type submit.
 * 6) Update JSON translation files.
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
    CreateEventHeaderContainerComponent
],
	templateUrl: "./create-event.component.html",
})
export class CreateEventComponent {
	step = 1;
	form!: FormGroup<ICreateEventForm>;
	formTitles = formTitles

	constructor(private fb: FormBuilder) {
		this.form = this.fb.nonNullable.group({
			eventDetailsForm: this.fb.nonNullable.group({
				title: this.fb.nonNullable.control("", Validators.required),
				description: this.fb.nonNullable.control("", Validators.required),
				date: this.fb.nonNullable.control(
					{} as NgbDateStruct,
					Validators.required
				),
				time: this.fb.nonNullable.control(
					{} as NgbTimeStruct,
					Validators.required
				),
			}),
			inviteUsersForm: this.fb.nonNullable.group({
				users: this.fb.nonNullable.control(""),
			})
		});
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.form.get(eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.form.get(inviteUsersForm) as FormGroup;
	}

	getSubFormTitles() {
		return [formTitles.eventDetailTitle, formTitles.addUserTitle, formTitles.formVerificationTitle];
	}

	getDerivedContainerStyle() {
		return { 'max-width': `${breakpoints.lg}px` };
	}

	nextStep() {
		const group = this.getGroupForStep(this.step);
		if (group.invalid) {
			group.markAllAsTouched();
			return;
		}
		this.step++;
	};

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
			console.log(this.form.value);
		} else {
			this.form.markAllAsTouched();
		}
	};
}
