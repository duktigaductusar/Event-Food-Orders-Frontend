import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppBaseComponent } from "@app/components/base";

@Component({
	selector: "app-datetimelabel",
	imports: [CommonModule],
	templateUrl: "./datetimelabel.component.html",
	styleUrl: "./datetimelabel.component.css",
})
export class DatetimelabelComponent extends AppBaseComponent {
	datevalue = input<Date>();
	endDateValue = input<Date>();
}
