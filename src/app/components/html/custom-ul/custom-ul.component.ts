import { Component, input } from "@angular/core";

import { AppCSSClassComponent } from "@app/components/base";

@Component({
	selector: "app-custom-ul",
	imports: [],
	templateUrl: "./custom-ul.component.html",
	styleUrl: "./custom-ul.component.css",
})
export class CustomUlComponent extends AppCSSClassComponent {
	override customClass = input("");
	override useClass = input("");
	title = input("");
	listItems = input<string[]>([]);

	protected override getDefaultClass(): string {
		return "py-2 text-primary-emphasis";
	}
}
