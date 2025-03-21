import { Component, OnInit, Signal, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { EventService } from "@app/services";
import { DatetimelabelComponent } from "../../../shared/datetimelabel/datetimelabel.component";
import { IEventDto } from "@app/models";
import { StatusLabelComponent } from "../status-label/status-label.component";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
	selector: "app-event-detail-item",
	imports: [DatetimelabelComponent, StatusLabelComponent, ResponsiveFormComponent, ReactiveFormsModule],
	templateUrl: "./event-detail-item.component.html",
	styleUrl: "./event-detail-item.component.css",
})
export class EventDetailItemComponent
	extends AppBaseComponent
	implements OnInit
{
	eventForm: FormGroup;
	selectedEventDto: Signal<IEventDto | null>;

	constructor(
		private router: Router,
		public service: EventService,
		private fb: FormBuilder
	) {
		super();
		this.selectedEventDto = signal(
			this.service.selectedEventDto()
		);
		this.eventForm = this.fb.group({
			preference: ["", [Validators.required, Validators.minLength(3)]],
			allergy: ["", [Validators.required, Validators.minLength(10)]],
		})
	}
	ngOnInit(): void {
		console.log(this.service?.selectedEventDto());
	}

	onSubmit() {
		if (this.eventForm.valid) {
			console.log("Event Created:", this.eventForm.value);
			alert("Event successfully created!");
		}
	}
}
