import { FormControl } from "@angular/forms";
import type { ParticipantResponseType } from "@types";

export interface IParticipantResponseForm {
    preferences: FormControl<string>;
    allergies: FormControl<string>;
    wantsMeal: FormControl<boolean>;
    responseType: FormControl<ParticipantResponseType>;
}