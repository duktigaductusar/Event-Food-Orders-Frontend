import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
	selector: "app-multistep-form-navigation-header",
	imports: [NgClass],
	templateUrl: "./multistep-form-navigation-header.component.html",
	styleUrl: "./multistep-form-navigation-header.component.css",
})
export class MultiStepFormHeaderComponent {
	@Input() steps!: string[];
	@Input() step = 1;


	getStepClass(currentStep: number, index: number): string {
		const stepNumber = index + 1;
	
		if (currentStep > stepNumber) {
			return 'text-white bg-primary border-primary';
		}
	
		if (currentStep === stepNumber) {
			return 'bg-white border border-primary text-primary fw-bold';
		}
	
		return 'bg-secondary text-white';
	}
	
}
