import {
	AfterViewInit,
	Component,
	Input,
	TemplateRef,
	ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
	NgbAccordionDirective,
	NgbAccordionModule,
} from "@ng-bootstrap/ng-bootstrap";

type LabelSizeFontSizeType = 1 | 2 | 3 | 4 | 5 | 6;

@Component({
	selector: "app-accordion-list",
	standalone: true,
	imports: [CommonModule, NgbAccordionModule],
	templateUrl: "./accordion-list.component.html",
	styleUrl: "accordion-list.component.css",
})
export class AccordionListComponent<T extends { id: string }>
	implements AfterViewInit
{
	@Input() label = "Items";
	@Input() labelNoItems = "";
	@Input() labelFontSize: LabelSizeFontSizeType = 5;
	@Input() items: T[] = [];
	@Input() itemTemplate!: TemplateRef<unknown>;
	@Input() open = false;
	@ViewChild(NgbAccordionDirective) accordion!: NgbAccordionDirective;

	get labelClass(): string {
		return `fs-${this.labelFontSize}`;
	}

	ngAfterViewInit(): void {
		if (!this.open) {
			return;
		}

		this.accordion.expandAll();
	}
}
