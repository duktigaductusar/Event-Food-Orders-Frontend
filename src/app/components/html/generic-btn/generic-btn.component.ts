import { Component, input, output } from "@angular/core";
import { CSSClassComponent } from "@app/components/base/css-class-base.component";

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
export class GenericBtnComponent extends CSSClassComponent {
	borderColor = input<GenericBtnCompClrType>("secondary");
	label = input("Click Me");
	icon = input("pencil");
	iconRight = input(false);
	disabled = input(false);
	action = output<MouseEvent>();

	protected override getDefaultClass(): string {
		return `btn btn-sm w-100 btn-outline-${this.borderColor()}`;
	}

	onClick(event: MouseEvent) {
		this.action.emit(event);
	}
}
