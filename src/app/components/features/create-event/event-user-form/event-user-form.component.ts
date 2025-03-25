import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";

@Component({
  selector: 'app-event-user-form',
  imports: [ResponsiveFormComponent],
  templateUrl: './event-user-form.component.html',
  styleUrl: './event-user-form.component.css'
})
export class EventUserFormComponent {
  @Input() form!: FormGroup;
  @Input() step!: number;
  @Input() title = "";

  // TODO Move to service or something else more shared.
	private getControl(controlName: string): AbstractControl {
		return this.form.get(controlName)!;
	}

	// TODO Move to service or something else more shared.
	getControlClass(controlName: string): string[] {
		const control = this.getControl(controlName);
		return [
			"form-control",
			control.invalid && control.touched ? "is-invalid" : "",
		];
	}

  getControlClass2(controlName: string): string[] {
    const control = this.getControl(controlName);
    return [
      control.invalid && control.touched ? 'is-invalid' : '',
    ];
  }

	// TODO Move to service or something else more shared.
	shouldShowError(controlName: string): boolean {
		const control = this.getControl(controlName);
		return control.invalid && control.touched;
	}

	// TODO Move to service or something else more shared.
	hasError(controlName: string, error: string): boolean {

		const control = this.getControl(controlName);
		return control.touched && control.hasError(error);
	}
}
