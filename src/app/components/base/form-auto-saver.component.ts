import { FormGroup } from "@angular/forms";
import { StorageKeyType, StorageService, StorageType } from "@app/services";
import { Subscription, debounceTime } from "rxjs";

const defaultDebounceTime = 5000;

export class FormAutoSaver<T> {
	private sub?: Subscription;
	private unloadHandler;
	private storageType: StorageType;

	constructor(
		private form: FormGroup,
		private storageService: StorageService,
		private storageKey: StorageKeyType,
		private typeGuard: (value: unknown) => value is T,
		options?: {
			debounceTimeMs?: number;
			storageType?: StorageType;
		}
	) {
		this.storageType = options?.storageType ?? "local";

		const saved = this.storageService.getItem<T>(
			this.storageKey,
			this.typeGuard,
			this.storageType
		);

		if (saved != null) {
			this.form.patchValue(saved);
		}

		const debounceMs = options?.debounceTimeMs ?? defaultDebounceTime;
		this.sub = this.form.valueChanges
			.pipe(debounceTime(debounceMs))
			.subscribe(value => {
				this.storageService.setItem<T>(
					this.storageKey,
					value,
					this.storageType
				);
			});

		this.unloadHandler = () => {
			this.storageService.setItem<T>(
				this.storageKey,
				this.form.getRawValue(),
				this.storageType
			);
		};
		window.addEventListener("beforeunload", this.unloadHandler);
	}

	destroy(): void {
		this.sub?.unsubscribe();
		window.removeEventListener("beforeunload", this.unloadHandler);
	}
}
