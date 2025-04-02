import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";

@Component({
	selector: "app-required-label",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./required-label.component.html",
	styleUrl: "./required-label.component.css",
})
export class RequiredLabelComponent {
	for = input("");
	label = input("An input label");
	withClass = input("");

	getDerivedClass(): string[] {
		return ["text-danger", "fw-bolder", this.withClass()].filter(Boolean);
	}
}
