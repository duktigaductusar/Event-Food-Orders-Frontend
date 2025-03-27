import { Component, Input } from "@angular/core";
import {
	FormGroup,
	ReactiveFormsModule,
	AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
	NgbDatepickerModule,
	NgbTimepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ResponsiveFormComponent } from "@app/components/html";
import { EventDetailsValidationGroupKeysType, EventDetailsValidationKeysType, IEventDetailsForm } from "../interfaces";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { eventDetailsValidationGroupKeys, eventDetailsValidationKeys } from "../constants";

@Component({
	selector: "app-event-details-form",
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgbDatepickerModule,
		NgbTimepickerModule,
		ResponsiveFormComponent,
	],
	templateUrl: "./event-details-form.component.html",
	styleUrl: "./event-details-form.component.css",
})
export class EventDetailsFormComponent extends AppBaseComponent {
	readonly formValidationKeys = eventDetailsValidationKeys
	readonly formValidationGroupKeys = eventDetailsValidationGroupKeys
	@Input() form!: FormGroup<IEventDetailsForm>;
	@Input() step!: number;
	@Input() title = "";

	private getControl(controlName: string): AbstractControl {
		return this.form.get(controlName)!;
	}

	getControlClass(controlName: string, withFormControl = true): string[] {
		const control = this.getControl(controlName);
		if (withFormControl) {
			return [
				"form-control",
				control.invalid && control.touched ? "is-invalid" : "",
			];
		}
		return [control.invalid && control.touched ? "is-invalid" : ""];
	}

	shouldShowError(controlName: string): boolean {
		const control = this.getControl(controlName);
		return control.invalid && control.touched;
	}

	hasError(controlName: string, error: EventDetailsValidationKeysType): boolean {
		const control = this.getControl(controlName);
		return control.touched && control.hasError(error);
	}

	hasGroupError(errorKey: EventDetailsValidationGroupKeysType): boolean {
		return this.form?.touched && this.form?.errors?.[errorKey];
	}
}
