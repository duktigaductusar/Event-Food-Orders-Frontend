import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

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
	imports: [CommonModule],
	templateUrl: "generic-btn.component.html",
})
export class GenericBtnComponent {
	@Input() borderColor: GenericBtnCompClrType = "secondary";
	@Input() label = "Click Me";
	@Input() icon = "pencil";
	@Input() iconRight = false;
	@Input() customClass = "";
	@Input() disabled = false;

	@Output() action = new EventEmitter<Event>();

	getDerivedClass() {
		return `btn-outline-${this.borderColor} ${this.customClass}`;
	}

	isDisabled() {
		return this.disabled;
	}

	onClick(event?: Event) {
		this.action.emit(event);
	}
}
