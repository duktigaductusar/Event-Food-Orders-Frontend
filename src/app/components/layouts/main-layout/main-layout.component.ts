import { ChangeDetectorRef, Component } from "@angular/core";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { appRoutes } from "@app/constants";
import { AppBaseComponent } from "@app/components/base/app-base.component";

@Component({
	selector: "app-main-layout",
	standalone: true,
	imports: [RouterModule],
	templateUrl: "./main-layout.component.html",
	styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent extends AppBaseComponent {
	readonly appRoutes = appRoutes;

	constructor(
		private offcanvasService: NgbOffcanvas,
		private cdRef: ChangeDetectorRef 
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
}
