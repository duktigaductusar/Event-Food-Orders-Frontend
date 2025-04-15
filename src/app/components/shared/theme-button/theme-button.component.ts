import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";

import { ButtonWrapperComponent } from "@app/components/html";
import { ThemeService } from "@app/services";

@Component({
	selector: "app-theme-button",
	imports: [CommonModule, ButtonWrapperComponent, NgbPopoverModule],
	templateUrl: "./theme-button.component.html",
	styleUrl: "./theme-button.component.css",
})
export class ThemeButtonComponent {
	title = input("Toggle dark and light themes");

	constructor(public readonly themeService: ThemeService) {}

	toggle() {
		this.themeService.toggleTheme();
	}
}
