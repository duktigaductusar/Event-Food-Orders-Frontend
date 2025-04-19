import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";

import { appRoutes, appRoutesPara } from "@app/constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { ThemeButtonComponent } from "@app/components/shared";
import { ButtonWrapperComponent } from "@app/components/html";
import { RouterService } from "@app/services";

@Component({
	selector: "app-main-layout",
	standalone: true,
	imports: [RouterModule, ThemeButtonComponent, ButtonWrapperComponent],
	templateUrl: "./main-layout.component.html",
	styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent extends AppBaseComponent implements OnInit {
	readonly appRoutes = appRoutes;
	eventId: string | undefined;

	constructor(
		private readonly offcanvasService: NgbOffcanvas,
		private readonly cdRef: ChangeDetectorRef,
		private readonly route: ActivatedRoute,
		readonly routerService: RouterService
	) {
		super();
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			console.log(params);
			const eventId = params.get(appRoutesPara.eventId);
			if (eventId != null) {
				this.eventId = eventId;
			}
		});
	}

	openSidebar(content: unknown) {
		this.offcanvasService.open(content, { position: "end" });
	}

	closeSidebar() {
		this.offcanvasService.dismiss();
		this.cdRef.detectChanges();
	}
}
