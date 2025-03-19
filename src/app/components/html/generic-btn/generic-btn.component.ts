import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GenericBtnCompClrType = (
  "secondary" | "primary" | "danger" | "warning"
)

@Component({
  selector: 'app-generic-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn btn-sm w-100"
      [ngClass]="'btn-outline-' + borderColor"
      (click)="onClick($event)"
    >
      <i [class]="'bi bi-' + icon"></i> {{ label }}
    </button>
  `
})
export class GenericBtnComponent {
  @Input() borderColor: GenericBtnCompClrType = 'secondary';
  @Input() label = 'Click Me';
  @Input() icon = 'pencil';

  @Output() action = new EventEmitter<Event>();

  onClick(event: Event) {
    this.action.emit(event);
  }
}