import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ButtonWrapperComponent } from "@app/components/html";
import { ThemeService } from "@app/services";

@Component({
	selector: "app-theme-button",
	imports: [CommonModule, ButtonWrapperComponent],
	templateUrl: "./theme-button.component.html",
	styleUrl: "./theme-button.component.css",
})
export class ThemeButtonComponent {
	constructor(public readonly themeService: ThemeService) {}

	toggle() {
		this.themeService.toggleTheme();
	}
}
