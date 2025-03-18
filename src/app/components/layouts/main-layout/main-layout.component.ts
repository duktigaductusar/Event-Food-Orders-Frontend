import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { appRoutes } from '@app/constants';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  readonly appRoutes = appRoutes;

  constructor(private offcanvasService: NgbOffcanvas) {}

  openSidebar(content: unknown) {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
