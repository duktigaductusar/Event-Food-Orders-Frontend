export const formControllers = {
    title: "title",
    description: "description",
    date: "date",
    time: "time",
    endTime: "endTime",
    dateDeadline: "dateDeadline",
    timeDeadline: "timeDeadline",
    users: "users",
} as const

export const formGroups = {
    eventDetailsForm: "eventDetailsForm",
    inviteUsersForm: "inviteUsersForm",
    verifyForm: "verifyForm" // An empty form group used for verification.
} as const
