import { Component, Input } from "@angular/core";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { FormGroup } from "@angular/forms";
import { ICreateEventForm } from "../interfaces";
import { formTitles } from "../constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";

@Component({
	selector: "app-verify-event-form",
	imports: [ResponsiveFormComponent],
	templateUrl: "./verify-event-form.component.html",
	styleUrl: "./verify-event-form.component.css",
})
export class VerifyEventFormComponent extends AppBaseComponent {
	formTitles = formTitles;
	@Input() form!: FormGroup<ICreateEventForm>;
	@Input() step!: number;
	@Input() title = "";
}
