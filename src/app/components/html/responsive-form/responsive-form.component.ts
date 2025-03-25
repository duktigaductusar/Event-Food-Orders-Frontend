import { Component, HostListener, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { breakpoints } from "@app/components/style";

//todo:
// 1.Goal is for the form to be reusable throughout the whole application.
@Component({
	selector: "app-responsive-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./responsive-form.component.html",
	styleUrls: ["./responsive-form.component.css"],
})
export class ResponsiveFormComponent {
	@Input() formGroup!: FormGroup;
	@Input() submitHandler!: () => void;
	@Input() withParentStyle = "";
	@Input() useResponsiveDesign = false;

	isSmallScreen = false;

	computedClass() {
		if (this.useResponsiveDesign && this.isSmallScreen) {
			return "";
		} else if (this.withParentStyle.length !== 0) {
			return this.withParentStyle;
		}
		return `card shadow-sm mb-4 py-3 card-header d-flex justify-content-between`;
	}

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
}
