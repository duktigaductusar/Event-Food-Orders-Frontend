import { Component, computed, input, OnDestroy, OnInit, output, signal } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { IInviteForm } from "../interfaces";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { UserService } from "@app/services";
import { IUserDto } from "@app/models";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";

@Component({
	selector: "app-event-user-form",
	imports: [ResponsiveFormComponent, FormsModule],
	templateUrl: "./event-user-form.component.html",
	styleUrl: "./event-user-form.component.css",
})
export class EventUserFormComponent extends AppBaseComponent implements OnInit, OnDestroy {
	private users: IUserDto[] = [];
	query = "";
	private querySubject = new Subject<string>();
	private destroySubject = new Subject<void>();
	form = input<FormGroup<IInviteForm>>(null!);
	selectedUsers = input<IUserDto[]>([]);
	step = input<number>(null!);
	title = input<string>(null!);
	derivedTitle = computed<string>(() => `${this.step()}. ${this.title()}`)
	selectedUsersChange = output<IUserDto>();
	isPending = signal(false);

	constructor(private service: UserService) {
		super();
	}

	get filteredUsers(): IUserDto[] {
		return this.users.filter(user =>
			user.email.toLowerCase().includes(this.query.toLowerCase()) ||
			user.username.toLowerCase().includes(this.query.toLowerCase())
		);
	}

	ngOnInit() {
		this.setupSearchListener();
	}

	ngOnDestroy() {
		this.destroySubject.next();
		this.destroySubject.complete();
	}

	private setupSearchListener() {
		this.querySubject.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			takeUntil(this.destroySubject)
		).subscribe(q => {
			this.getUsers(q);
		});
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

		this.isPending.set(true);
		this.service.getUsers(query).subscribe({
			next: u => { this.users = u; },
			error: error => {
				console.error("Error fetching users:", error);
				this.users = [];
			},
			complete: () => { this.isPending.set(false); },
		});
	}

	toggleSelect(user: IUserDto) {
		this.selectedUsersChange.emit(user);
	}

	isSelected(user: IUserDto): boolean {
		return this.selectedUsers().map(u => u.userId).includes(user.userId);
	}
}
