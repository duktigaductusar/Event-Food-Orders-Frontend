import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";

import { FormStepsTyp } from "../interfaces";

@Component({
	selector: "app-multistep-form-navigation-header",
	imports: [NgClass],
	templateUrl: "./multistep-form-navigation-header.component.html",
	styleUrl: "./multistep-form-navigation-header.component.css",
})
export class MultiStepFormHeaderComponent {
	@Input() steps!: string[];
	@Input() step: FormStepsTyp = 1;

	getStepClassCircles(currentStep: number, index: number): string {
		const stepNumber = index + 1;

		if (currentStep > stepNumber) {
			return "text-white multip-step-form-navigation-prev";
		}

		if (currentStep === stepNumber) {
			return "multip-step-form-navigation-active";
		}

		return "multip-step-form-navigation-next";
	}

	getStepClassLines(currentStep: number, index: number): string {
		const stepNumber = index + 1;

		if (currentStep >= stepNumber) {
			return "flex-grow-1 multip-step-form-navigation-prev-line";
		}

		return "flex-grow-1 multip-step-form-navigation-next-line";
	}
}
