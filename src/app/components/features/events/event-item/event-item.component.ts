import { Component, Input, Output, EventEmitter } from "@angular/core";
import type { IEventDto } from "@app/models";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { DatetimelabelComponent } from "@app/components/shared/datetimelabel/datetimelabel.component";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";

@Component({
	selector: "app-event-item",
	standalone: true,
	imports: [DatetimelabelComponent, GenericBtnComponent],
	templateUrl: "event-item.component.html",
	styleUrl: "event-item.component.css",
})
export class EventItemComponent extends AppBaseComponent {
	@Input() card!: IEventDto;
	@Output() cardClick = new EventEmitter<void>();
	@Output() actionClick = new EventEmitter<{
		action: string;
		card: IEventDto;
	}>();

	onAction(event: Event, action: string): void {
		event.stopPropagation(); // Prevent card click event
		this.actionClick.emit({ action, card: this.card });
	}

	// selectMoreInfo() {
	// 	throw new Error("");
	// }

	// showInvitation() {
	// 	throw new Error("");
	// }
}
