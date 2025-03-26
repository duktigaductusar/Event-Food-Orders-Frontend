import { Component, Input, OnInit } from "@angular/core";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { FormGroup } from "@angular/forms";
import { ICreateEventForm } from "../interfaces";
import { formTitles } from "../constants";

@Component({
	selector: "app-verify-event-form",
	imports: [ResponsiveFormComponent],
	templateUrl: "./verify-event-form.component.html",
	styleUrl: "./verify-event-form.component.css",
})
export class VerifyEventFormComponent implements OnInit {
	formTitles = formTitles;
	@Input() form!: FormGroup<ICreateEventForm>;
	@Input() step!: number;
	@Input() title = "";

	ngOnInit(): void {
		console.log(this.form.value);
	}
}
