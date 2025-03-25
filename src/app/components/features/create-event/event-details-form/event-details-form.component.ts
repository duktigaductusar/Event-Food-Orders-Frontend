import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from "@angular/common";
import {
	NgbDatepickerModule,
	NgbTimepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ResponsiveFormComponent } from "@app/components/html";

@Component({
  selector: 'app-event-details-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ResponsiveFormComponent
 ],
  templateUrl: './event-details-form.component.html',
  styles: [
		`
			.container {
				max-width: 600px;
			}
			.card {
				border-radius: 10px;s
			}
			.form-label {
				font-weight: bold;
			}
			.bi {
				margin-left: 5px;
			}
		`,
	],
})
export class EventDetailsFormComponent {
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

  toDateTime = (
    date: { day: number; month: number; year: number },
    time: { hour: number; minute: number; second: number }) => {
    return new Date(
      date.year,
      date.month - 1,
      date.day,
      time.hour,
      time.minute,
      time.second
    );
  };
}
