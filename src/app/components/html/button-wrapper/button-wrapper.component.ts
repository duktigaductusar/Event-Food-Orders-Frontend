import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";

import { AppCSSClassComponent } from "../base/app-css-class.component";

@Component({
	selector: "app-button-wrapper",
	imports: [CommonModule],
	templateUrl: "./button-wrapper.component.html",
	styleUrl: "./button-wrapper.component.css",
})
export class ButtonWrapperComponent extends AppCSSClassComponent {
	override customClass = input("");
	override useClass = input("");
	selected = output<MouseEvent>();
	isFocused = false;

	onSelected(event: MouseEvent) {
		this.selected.emit(event);
	}

	protected override getDefaultClass(): string {
		const common = "bg-transparent btn-focus-outline border-0 p-0 m-0";

		return this.isFocused
			? `${common} btn-outline-primary`
			: `${common} bg-transparent`;
	}
}
