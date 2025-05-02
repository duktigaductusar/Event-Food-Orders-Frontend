import { Injectable, signal } from '@angular/core';

@Injectable()
export class EventFormBaseService {
	isPending = signal<boolean>(false);

	updateIsPending(pending: boolean) {
		this.isPending.set(pending);
	}
}
