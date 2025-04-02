import { Directive, input } from "@angular/core";
import { AppBaseComponent } from "./app-base.component";

@Directive()
export abstract class CSSClassComponent extends AppBaseComponent {
	customClass = input<string>("");
	useClass = input<string>("");

	protected abstract getDefaultClass(): string;

	get computedClass(): string {
		const override = this.useClass().trim();
		if (override !== "") {
			return override;
		}

		const base = this.getDefaultClass().trim();
		const extra = this.customClass().trim();
		return extra !== "" ? `${base} ${extra}` : base;
	}
}
