import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { breakpoints } from "@app/components/style";

@Component({
	selector: "app-responsive-div",
	imports: [CommonModule],
	templateUrl: "./responsive-div.component.html",
	styleUrl: "./responsive-div.component.css",
})
export class ResponsiveDivComponent {
	@Input() withParentStyle = "";
	@Input() useResponsiveDesign = false;

	isSmallScreen = false;

	constructor() {
		this.checkScreenSize();
	}

	@HostListener("window:resize", [])
	onResize() {
		this.checkScreenSize();
	}

	private checkScreenSize() {
		this.isSmallScreen = window.innerWidth < breakpoints.sm;
	}

	computedClass(): string {
		if (this.useResponsiveDesign && this.isSmallScreen) {
			return "";
		} else if (this.withParentStyle.length !== 0) {
			return this.withParentStyle;
		}
		return `card shadow-sm mb-4 py-3 card-header d-flex justify-content-between`;
	}
}
