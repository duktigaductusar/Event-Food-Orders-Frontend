import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";

@Component({
	selector: "app-datetimelabel",
	imports: [CommonModule],
	templateUrl: "./datetimelabel.component.html",
	styleUrl: "./datetimelabel.component.css",
})
export class DatetimelabelComponent {
	datevalue = input<Date>();
	endDateValue = input<Date>();
}
