import { Component, Input } from '@angular/core';
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { MultiStepFormHeaderComponent } from "../multistep-form-navigation-header/multistep-form-navigation-header.component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verify-event-form',
  imports: [ResponsiveFormComponent, MultiStepFormHeaderComponent],
  templateUrl: './verify-event-form.component.html',
  styleUrl: './verify-event-form.component.css'
})
export class VerifyEventFormComponent {
  @Input() form!: FormGroup;
}
