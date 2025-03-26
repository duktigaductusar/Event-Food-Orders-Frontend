import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { IInviteForm } from "../interfaces";

@Component({
	selector: "app-event-user-form",
	imports: [ResponsiveFormComponent, FormsModule],
	templateUrl: "./event-user-form.component.html",
	styleUrl: "./event-user-form.component.css",
})
export class EventUserFormComponent {
	@Input() form!: FormGroup<IInviteForm>;
	@Input() step!: number;
	@Input() title = "";
	@Input() selectedEmails: string[] = [];

	searchTerm = "";

	emails: string[] = [
		"anna.svensson@ductus.se",
		"erik.nilsson@ductus.se",
		"johan.larsson@ductus.se",
		"karl.johansson@ductus.se",
		"lisa.andersson@ductus.se",
		"marcus.pettersson@ductus.se",
		"eva.olsson@ductus.se",
		"daniel.karlsson@ductus.se",
		"sofie.nyström@ductus.se",
		"mats.sjöberg@ductus.se",
		"carina.ahlberg@ductus.se",
		"fredrik.lindqvist@ductus.se",
		"emma.holmgren@ductus.se",
		"jonas.sundberg@ductus.se",
		"nina.eriksson@ductus.se",
		"henrik.björk@ductus.se",
		"camilla.lind@ductus.se",
		"patrik.dahl@ductus.se",
		"maria.forsberg@ductus.se",
		"andreas.nordin@ductus.se",
		"ida.jacobsson@ductus.se",
		"peter.berglund@ductus.se",
		"sofia.larsson@ductus.se",
		"tobias.hansson@ductus.se",
		"sara.eklund@ductus.se",
		"martin.holm@ductus.se",
		"jenny.bergström@ductus.se",
		"alexander.lindgren@ductus.se",
		"malin.jonsson@ductus.se",
		"linus.karlberg@ductus.se",
		"rebecca.sundin@ductus.se",
		"mikael.andersson@ductus.se",
		"frida.lindahl@ductus.se",
		"josefine.wiklund@ductus.se",
		"sebastian.nilsson@ductus.se",
		"elin.sandberg@ductus.se",
		"joakim.berg@ductus.se",
		"therese.holmberg@ductus.se",
		"niklas.sjödin@ductus.se",
		"agnes.lundgren@ductus.se",
	];

	get filteredEmails(): string[] {
		if (this.searchTerm.length < 1) return [];
		return this.emails.filter(email =>
			email.toLowerCase().includes(this.searchTerm.toLowerCase())
		);
	}

	toggleSelect(email: string) {
		const index = this.selectedEmails.indexOf(email);
		if (index > -1) {
			this.selectedEmails.splice(index, 1);
		} else {
			this.selectedEmails.push(email);
		}

		this.form.get("emails")?.setValue([...this.selectedEmails]);
		this.form.get("emails")?.markAsTouched();
	}

	isSelected(email: string): boolean {
		return this.selectedEmails.includes(email);
	}
}
