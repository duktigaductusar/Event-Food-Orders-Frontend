import { Component, Input, OnDestroy, OnInit, signal } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import { IInviteForm } from "../interfaces";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { UserService } from "@app/services";
import { IUserDto } from "@app/models";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { users as usersFormFieldName } from "../constants";

@Component({
	selector: "app-event-user-form",
	imports: [ResponsiveFormComponent, FormsModule],
	templateUrl: "./event-user-form.component.html",
	styleUrl: "./event-user-form.component.css",
})
export class EventUserFormComponent extends AppBaseComponent implements OnInit, OnDestroy {
	@Input() form!: FormGroup<IInviteForm>;
	@Input() step!: number;
	@Input() title = "";
	@Input() selectedUsers: IUserDto[] = [];

	isPending = signal(false);
	query = "";
	users: IUserDto[] = [];

	private querySubject = new Subject<string>();
	private destroy$ = new Subject<void>();

	constructor(private service: UserService) {
		super();
	}

	ngOnInit() {
		this.setupSearchListener();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private setupSearchListener() {
		this.querySubject.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			takeUntil(this.destroy$)
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
			next: users => {
				this.users = users;
			},
			error: error => {
				console.error("Error fetching users:", error);
				this.users = [];
			},
			complete: () => this.isPending.set(false),
		});
	}

	get filteredUsers(): IUserDto[] {
		// Filter locally if needed (or just return this.users if server handles filtering)
		return this.users.filter(user =>
			user.email.toLowerCase().includes(this.query.toLowerCase()) ||
			user.username.toLowerCase().includes(this.query.toLowerCase())
		);
	}

	toggleSelect(user: IUserDto) {
		const indexUser = this.selectedUsers.indexOf(user);

		console.log("user", user)

		if (indexUser > -1) {
			this.selectedUsers.splice(indexUser, 1);
		} else {
			this.selectedUsers.push(user);
		}

		console.log("this.selectedUsers", this.selectedUsers)

		this.form.get(usersFormFieldName)?.setValue([...this.selectedUsers]);
		this.form.get(usersFormFieldName)?.markAsTouched();

		console.log("this.form.get(usersFormFieldName)", this.form.get(usersFormFieldName))
	}

	isSelected(user: IUserDto): boolean {
		return this.selectedUsers.includes(user);
	}
}