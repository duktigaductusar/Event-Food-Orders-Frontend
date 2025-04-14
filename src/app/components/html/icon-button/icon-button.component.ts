import { Component, input, output } from "@angular/core";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

import { CSSClassComponent } from "@app/components/base";
import { ButtonWrapperComponent } from "..";

@Component({
	selector: "app-icon-button",
	imports: [ButtonWrapperComponent, NgbPopoverModule],
	templateUrl: "./icon-button.component.html",
	styleUrl: "./icon-button.component.css",
})
export class IconButtonComponent extends CSSClassComponent {
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
