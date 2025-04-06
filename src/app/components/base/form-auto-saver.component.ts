import { FormGroup } from "@angular/forms";
import {
	defaultStorage,
	StorageKeyType,
	StorageService,
	StorageType,
} from "@app/services";
import { Subscription, debounceTime } from "rxjs";

const defaultDebounceTime = 2000;

// TODO Check if stored event have same id as new event or something
// to avoid bug/issue
export class FormAutoSaver<T> {
	private sub?: Subscription;
	private unloadHandler;
	private storageType: StorageType;
	private debounceMs: number;

	constructor(
		private form: FormGroup,
		private storageService: StorageService,
		private storageKey: StorageKeyType,
		private typeGuard: (value: unknown) => value is T,
		options?: {
			debounceTimeMs?: number;
			storageType?: StorageType;
			setupCallback?: () => void;
		}
	) {
		this.storageType = options?.storageType ?? defaultStorage;

		this.debounceMs = options?.debounceTimeMs ?? defaultDebounceTime;

		this.unloadHandler = () => {
			this.storageService.setItem<T>(
				this.storageKey,
				this.form.getRawValue(),
				this.storageType
			);
		};

		if (options?.setupCallback != null) {
			options?.setupCallback();
		}
	}

	subscribe() {
		const saved = this.storageService.getItem<T>(
			this.storageKey,
			this.typeGuard,
			this.storageType
		);

		if (saved != null) {
			this.form.patchValue(saved);
		}

		this.sub = this.form.valueChanges
			.pipe(debounceTime(this.debounceMs))
			.subscribe(value => {
				this.storageService.setItem<T>(
					this.storageKey,
					value,
					this.storageType
				);
			});

		window.addEventListener("beforeunload", this.unloadHandler);
	}

	destroy(): void {
		this.sub?.unsubscribe();
		window.removeEventListener("beforeunload", this.unloadHandler);
	}
}
