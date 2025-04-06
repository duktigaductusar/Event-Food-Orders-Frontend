import {
	Component,
	computed,
	input,
	ViewChild,
	effect,
	AfterViewInit,
} from "@angular/core";
import {
	FormGroup,
	ReactiveFormsModule,
	AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
	NgbDatepicker,
	NgbDatepickerModule,
	NgbDateStruct,
	NgbTimepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import {
	RequiredLabelComponent,
	ResponsiveFormComponent,
} from "@app/components/html";
import {
	EventDetailsFormControllerNameType,
	EventDetailsValidationGroupKeysType,
	EventDetailsValidationKeysType,
	IEventDetailsForm,
} from "../interfaces";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import {
	eventDetailsControllerNames,
	eventDetailsValidationGroupKeys,
	eventDetailsValidationKeys,
	formControllers,
} from "../constants";
import { InvalidInputFeedbackComponent } from "@app/components/shared/invalid-input-feedback/invalid-input-feedback.component";

@Component({
	selector: "app-event-details-form",
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgbDatepickerModule,
		NgbTimepickerModule,
		ResponsiveFormComponent,
		RequiredLabelComponent,
		InvalidInputFeedbackComponent,
	],
	templateUrl: "./event-details-form.component.html",
	styleUrl: "./event-details-form.component.css",
})
export class EventDetailsFormComponent
	extends AppBaseComponent
	implements AfterViewInit
{
	readonly formValidationKeys = eventDetailsValidationKeys;
	readonly formValidationGroupKeys = eventDetailsValidationGroupKeys;
	readonly eventDetailsControllerNames = eventDetailsControllerNames;
	form = input<FormGroup<IEventDetailsForm>>(null!);
	step = input<number>(null!);
	title = input("");
	changedDeadline = input<NgbDateStruct | null>(null);
	derivedTitle = computed<string>(() => `${this.step()}. ${this.title()}`);
	@ViewChild("datePicker") datePicker?: NgbDatepicker;
	@ViewChild("deadlineDatePicker") deadlineDatePicker?: NgbDatepicker;

	constructor() {
		super();
		this.changedDeadlineEffect();
	}

	changedDeadlineEffect() {
		effect(() => {
			const value = this.changedDeadline();
			if (value == null) {
				return;
			}
			this.deadlineDatePicker?.navigateTo(value);
		});
	}

	ngAfterViewInit(): void {
		this.datePicker?.navigateTo(
			this.getControl(formControllers.date).value
		);
		this.deadlineDatePicker?.navigateTo(
			this.getControl(formControllers.dateDeadline).value
		);
	}

	private getControl(
		controlName: EventDetailsFormControllerNameType
	): AbstractControl {
		return this.form().get(controlName)!;
	}

	getControlClass(
		controlName: EventDetailsFormControllerNameType,
		withFormControl = true
	): string[] {
		const control = this.getControl(controlName);
		if (withFormControl) {
			return [
				"form-control",
				control.invalid && control.touched ? "is-invalid" : "",
			];
		}
		return [control.invalid && control.touched ? "is-invalid" : ""];
	}

	shouldShowError(controlName: EventDetailsFormControllerNameType): boolean {
		const control = this.getControl(controlName);
		return control.invalid && control.touched;
	}

	hasError(
		controlName: EventDetailsFormControllerNameType,
		error: EventDetailsValidationKeysType
	): boolean {
		const control = this.getControl(controlName);
		return control.touched && control.hasError(error);
	}

	hasGroupError(errorKey: EventDetailsValidationGroupKeysType): boolean {
		return this.form().touched && this.form().errors?.[errorKey];
	}
}
