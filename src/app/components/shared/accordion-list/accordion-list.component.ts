import { Component, Input, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";

type LabelSizeFontSizeType = 1 | 2 | 3 | 4 | 5 | 6;

@Component({
	selector: "app-accordion-list",
	standalone: true,
	imports: [CommonModule, NgbAccordionModule],
	templateUrl: "./accordion-list.component.html",
	styleUrl: "accordion-list.component.css",
})
export class AccordionListComponent<T> {
	@Input() label = "Items";
	@Input() labelFontSize: LabelSizeFontSizeType = 5;
	@Input() items: T[] = [];
	@Input() itemTemplate!: TemplateRef<unknown>;

	get labelClass(): string {
		return `fs-${this.labelFontSize}`;
	}
}
