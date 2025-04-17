import { Component, input, output } from "@angular/core";

import { AppCSSClassComponent } from "../base/app-css-class.component";

export type GenericBtnCompClrType =
	| "secondary"
	| "primary"
	| "info"
	| "success"
	| "danger"
	| "warning";

@Component({
	selector: "app-generic-btn",
	standalone: true,
	templateUrl: "generic-btn.component.html",
})
export class GenericBtnComponent extends AppCSSClassComponent {
	override customClass = input("");
	override useClass = input("");
	borderColor = input<GenericBtnCompClrType>("secondary");
	label = input("Click Me");
	icon = input("pencil");
	iconRight = input(false);
	disabled = input(false);
	type = input<"submit" | "button">("button");
	action = output<MouseEvent>();

	protected override getDefaultClass(): string {
		return `btn btn-sm w-100 btn-outline-${this.borderColor()}`;
	}

	onClick(event: MouseEvent) {
		this.action.emit(event);
	}
}
