import { Component, Input } from "@angular/core";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { IEventDto } from "@app/models";

@Component({
	selector: "app-status-label",
	imports: [],
	templateUrl: "./status-label.component.html",
	styleUrl: "./status-label.component.css",
})
export class StatusLabelComponent extends AppBaseComponent {
	@Input() eventDto!: IEventDto;
}
