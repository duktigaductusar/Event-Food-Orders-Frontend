import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  NgbDatepickerModule,
  NgbTimepickerModule,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-create-event",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
  ],
  templateUrl: './create-event.component.html',
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
export class CreateEventComponent {
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      eventName: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      eventDate: [null, Validators.required],
      startTime: [null, Validators.required],
      location: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log("Event Created:", this.eventForm.value);
      alert("Event successfully created!");
    }
  }
}
