import { ChangeDetectorRef, Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import { appRoutes } from "@app/constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { ThemeButtonComponent } from "@app/components/shared";
import { ButtonWrapperComponent } from "@app/components/html";
import { Location } from "@angular/common";

@Component({
	selector: "app-main-layout",
	standalone: true,
	imports: [RouterModule, ThemeButtonComponent, ButtonWrapperComponent],
	templateUrl: "./main-layout.component.html",
	styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent extends AppBaseComponent {
	readonly appRoutes = appRoutes;

	constructor(
		private readonly offcanvasService: NgbOffcanvas,
		private readonly cdRef: ChangeDetectorRef,
		private readonly location: Location,
		private readonly router: Router
	) {
		super();
	}

	openSidebar(content: unknown) {
		this.offcanvasService.open(content, { position: "end" });
	}

	closeSidebar() {
		this.offcanvasService.dismiss();
		this.cdRef.detectChanges();
	}

	goBack() {
		this.location.back();
	}

	isHomePage(): boolean {
		return this.router.url === `${appRoutes.HOME}/`;
	}
}
