import {
	Component,
	computed,
	input,
	OnDestroy,
	OnInit,
	output,
	signal,
} from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
	Subject,
	debounceTime,
	distinctUntilChanged,
	finalize,
	takeUntil,
} from "rxjs";

import { AuthService, EventStateService, UserService } from "@app/services";
import { IUserDto } from "@app/models";

import {
	ResponsiveFormComponent,
	ButtonWrapperComponent,
	ResponsiveLiComponent,
} from "@app/components/html";
import { AccordionListComponent } from "@app/components/shared";
import { AppBaseComponent } from "@app/components/base";
import { environment } from "@environments/environment";

import { FormStepsTyp, IInviteForm, IUsersDtoWithId } from "../interfaces";

@Component({
	selector: "app-event-user-form",
	standalone: true,
	imports: [
		ResponsiveFormComponent,
		FormsModule,
		CommonModule,
		AccordionListComponent,
		ButtonWrapperComponent,
		ResponsiveLiComponent,
		ResponsiveLiComponent,
	],
	templateUrl: "./event-user-form.component.html",
	styleUrl: "./event-user-form.component.css",
})
export class EventUserFormComponent
	extends AppBaseComponent
	implements OnInit, OnDestroy
{
	private users: IUserDto[] = [];
	query = "";
	private querySubject = new Subject<string>();
	private destroySubject = new Subject<void>();
	isPending = signal(false);
	form = input<FormGroup<IInviteForm>>(null!);
	selectedUsers = input<IUserDto[]>([]);
	step = input<FormStepsTyp>(null!);
	title = input<string>(null!);
	derivedTitle = computed<string>(() => `${this.step()}. ${this.title()}`);
	isFocused = false;
	selectedUsersWithId = computed<IUsersDtoWithId[]>(() => {
		return this.selectedUsers()
			.sort((a, b) => a.email.localeCompare(b.email))
			.map(u => ({ ...u, id: u.userId }));
	});
	selectedUsersChange = output<IUserDto>();

	constructor(
		private readonly userService: UserService,
		private readonly eventStateService: EventStateService,
		public readonly authService: AuthService
	) {
		super();
	}

	ngOnInit() {
		this.setupSearchListener();
	}

	ngOnDestroy() {
		this.destroySubject.next();
		this.destroySubject.complete();
	}

	get filteredAndSortedUsers(): IUsersDtoWithId[] {
		return this.users
			.filter(
				user =>
					user.email != null &&
					user.username != null &&
					this.isValidEmailsDomains(user.email) &&
					(user.email
						.toLowerCase()
						.includes(this.query.toLowerCase()) ||
						user.username
							.toLowerCase()
							.includes(this.query.toLowerCase()))
			)
			.sort((a, b) => a.email.localeCompare(b.email))
			.map(u => ({ ...u, id: u.userId }));
	}

	private isValidEmailsDomains(email: string) {
		const allowedDomains = environment.allowedEmailDomains;
		return allowedDomains.some(domain => email.endsWith(domain));
	}

	private setupSearchListener() {
		this.querySubject
			.pipe(
				debounceTime(300),
				distinctUntilChanged(),
				takeUntil(this.destroySubject)
			)
			.subscribe(q => {
				this.getUsers(q);
			});
	}

	isDeletableUser(user: IUserDto) {
		return (
			this.authService.getActiveAccountUserId() !== undefined &&
			this.authService.getActiveAccountUserId() !== user.userId
		);
	}

	isOwner(user: IUserDto) {
		return this.authService.getActiveAccountUserId() === user.userId;
	}

	onSearchInputChange(query: string) {
		this.query = query;
		this.querySubject.next(query);
	}

	getUsers(query: string) {
		if (query.length < 1) {
			this.users = [];
			return;
		}

		const eventId = this.eventStateService.editEvent()
			? this.eventStateService.selectedEventDto()?.id
			: undefined;

		this.isPending.set(true);
		this.userService
			.getUsers(query, eventId)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: u => {
					this.users = u;
				},
				error: error => {
					console.error("Error fetching users:", error);
					this.users = [];
				},
			});
	}

	toggleSelect(user: IUserDto) {
		this.selectedUsersChange.emit(user);
	}

	onRemoveSelectedUser(user: IUserDto) {
		this.selectedUsersChange.emit(user);
	}

	getSelectedStyleForSearchResultItem(user: IUserDto) {
		const common = `
			w-100 border-0 p-3 d-flex flex-column
			align-items-start flex-sm-row justify-content-sm-between
			overflow-y-auto `;

		return this.isSelected(user)
			? `${common} bg-primary text-white`
			: `${common} bg-transparent`;
	}

	isSelected(user: IUserDto): boolean {
		return this.selectedUsers()
			.map(u => u.userId)
			.includes(user.userId);
	}
}
