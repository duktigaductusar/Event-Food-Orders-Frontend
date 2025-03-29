import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { breakpoints } from '@app/components/style';

@Component({
  selector: 'app-responsive-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './responsive-form.component.html',
  styleUrls: ['./responsive-form.component.css'],
})
export class ResponsiveFormComponent<
  T extends { [K in keyof T]: AbstractControl }
> {
  @Input() formGroup!: FormGroup<T>;
  @Input() submitHandler!: () => void;
  @Input() withParentStyle = '';
  @Input() useResponsiveDesign = false;

  isSmallScreen = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < breakpoints.sm;
  }

  computedClass(): string {
    if (this.useResponsiveDesign && this.isSmallScreen) {
      return '';
    } else if (this.withParentStyle.length !== 0) {
      return this.withParentStyle;
    }
    return `card shadow-sm mb-4 py-3 card-header d-flex justify-content-between`;
  }
}
