import { Component, HostListener, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

//todo:
// 1.Clean upp component
// 2.Goal is for the form to be reusable throughout the whole application

@Component({
	selector: "app-responsive-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./responsive-form.component.html",
	styleUrls: ["./responsive-form.component.scss"],
})
export class ResponsiveFormComponent {
	@Input() formGroup!: FormGroup;
	@Input() submitHandler!: () => void;
	@Input() withParentStyle = "";

	isSmallScreen = false;

	computedClass() {
		if (this.withParentStyle.length !== 0) {
			return this.withParentStyle;
		} else if (this.isSmallScreen) {
			return "";
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
		this.isSmallScreen = window.innerWidth < 500;
	}
}
