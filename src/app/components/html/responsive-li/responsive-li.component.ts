import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { CSSClassComponent } from "@app/components/base";

@Component({
	selector: "app-responsive-li",
	imports: [CommonModule],
	templateUrl: "./responsive-li.component.html",
	styleUrl: "./responsive-li.component.css",
})
export class ResponsiveLiComponent extends CSSClassComponent {
	protected override getDefaultClass(): string {
		return "list-group-item d-flex flex-column align-items-start flex-sm-row justify-content-sm-between overflow-y-auto";
	}
}
