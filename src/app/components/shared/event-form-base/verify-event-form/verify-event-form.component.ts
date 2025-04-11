import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ICreateEventForm, IUsersDtoWithId } from "../interfaces";
import { formTitles } from "../constants";
import { AccordionListComponent, AppBaseComponent, ResponsiveFormComponent, ResponsiveLiComponent } from "@app/components";

@Component({
	selector: "app-verify-event-form",
	imports: [ResponsiveFormComponent, ResponsiveLiComponent, AccordionListComponent],
	templateUrl: "./verify-event-form.component.html",
	styleUrl: "./verify-event-form.component.css",
})
export class VerifyEventFormComponent extends AppBaseComponent {
	formTitles = formTitles;
	@Input() form!: FormGroup<ICreateEventForm>;
	@Input() step!: number;
	@Input() title = "";

	selectedUsersWithId(): IUsersDtoWithId[] {
		return this.form.value.inviteUsersForm?.users?.map(u => ({
			...u,
			id: u.userId
		})) ?? []  
	}	
}
