import { Component, input, output } from "@angular/core";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

import { AppCSSClassComponent } from "../base/app-css-class.component";
import { ButtonWrapperComponent } from "..";

@Component({
	selector: "app-icon-button",
	imports: [ButtonWrapperComponent, NgbPopoverModule],
	templateUrl: "./icon-button.component.html",
	styleUrl: "./icon-button.component.css",
})
export class IconButtonComponent extends AppCSSClassComponent {
	override customClass = input("");
	override useClass = input("");
	title = input("");
	icon = input("pencil");
	disabled = input(false);
	action = output<MouseEvent>();

	protected override getDefaultClass(): string {
		return "app-icon-button";
	}

	onClick(event: MouseEvent) {
		this.action.emit(event);
	}
}
