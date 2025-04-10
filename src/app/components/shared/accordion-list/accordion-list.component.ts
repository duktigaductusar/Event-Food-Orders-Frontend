import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border rounded mb-2">
      <div
        class="d-flex justify-content-between align-items-center p-2 cursor-pointer"
        (click)="toggle()"
      >
        <span>{{ label }} ({{ items.length }})</span>
        <i
          class="bi"
          [ngClass]="{
            'bi-chevron-down': !open,
            'bi-chevron-up': open
          }"
        ></i>
      </div>

      <div *ngIf="open" class="p-2 border-top">
        <ng-container *ngIf="items.length; else empty">
          <ng-container *ngFor="let item of items">
            <ng-container
              *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"
            ></ng-container>
          </ng-container>
        </ng-container>

        <ng-template #empty>
          <div class="text-muted">No items to display.</div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
  `]
})
export class AccordionListComponent<T> {
  @Input() label = 'Items';
  @Input() items: T[] = [];
  @Input() itemTemplate!: TemplateRef<unknown>;

  open = false;

  toggle() {
    this.open = !this.open;
  }
}
