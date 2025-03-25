import { Component } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { eventDetailsForm, ICreateEventForm, inviteUsersForm } from "./interfaces";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";

@Component({
	selector: "app-create-event",
	standalone: true,
	imports: [
    EventDetailsFormComponent,
    EventUserFormComponent,
    VerifyEventFormComponent
],
	templateUrl: "./create-event.component.html",
})
export class CreateEventComponent {
	step = 1;

	form!: FormGroup<ICreateEventForm>;

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
				users: this.fb.nonNullable.control("", Validators.required),
			}),
		});
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.form.get(eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.form.get(inviteUsersForm) as FormGroup;
	}

	nextStep = () => {
		console.log("test")
		const group = this.getGroupForStep(this.step);
		console.log("group.invalid", group.invalid)
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
