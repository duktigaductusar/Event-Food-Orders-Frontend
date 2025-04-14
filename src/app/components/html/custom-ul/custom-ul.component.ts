import { Component, input } from "@angular/core";

@Component({
	selector: "app-custom-ul",
	imports: [],
	templateUrl: "./custom-ul.component.html",
	styleUrl: "./custom-ul.component.css",
})
export class CustomUlComponent {
	title = input("");
	listItems = input<string[]>([]);
}
