import { Component, HostListener, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

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

	isSmallScreen = false;

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
