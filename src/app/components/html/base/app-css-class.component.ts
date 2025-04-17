import { InputSignal } from "@angular/core";

export abstract class AppCSSClassComponent {
	abstract customClass: InputSignal<string>;
	abstract useClass: InputSignal<string>;

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
