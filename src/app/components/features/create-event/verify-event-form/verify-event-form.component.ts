import { Component, Input } from '@angular/core';
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verify-event-form',
  imports: [ResponsiveFormComponent],
  templateUrl: './verify-event-form.component.html',
  styleUrl: './verify-event-form.component.css'
})
export class VerifyEventFormComponent {
  @Input() form!: FormGroup;
  @Input() step!: number;
  @Input() title = "";
}
