import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { IEventDto } from "@app/models"

@Component({
  selector: "event-item",
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'event-item.component.html',
  styleUrl: 'event-item.component.css',  
})
export class EventItemComponent {
  @Input() card!: IEventDto
  @Output() cardClick = new EventEmitter<void>()
  @Output() actionClick = new EventEmitter<{ action: string; card: IEventDto }>()


  onAction(event: Event, action: string): void {
    event.stopPropagation() // Prevent card click event
    this.actionClick.emit({ action, card: this.card })
  }

  selectMoreInfo() {}

  showInvitation() {}
}

