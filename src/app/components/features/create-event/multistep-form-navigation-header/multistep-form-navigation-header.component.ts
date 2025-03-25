import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
	selector: "app-multistep-form-navigation-header",
	imports: [NgClass],
	templateUrl: "./multistep-form-navigation-header.component.html",
	styleUrl: "./multistep-form-navigation-header.component.css",
})
export class MultiStepFormHeaderComponent {
	readonly steps = ["Event Detaljer", "Ange deltagare", "Verifiera"] as const;
	@Input() step = 1;
}
