/// <reference types="@angular/localize" />

import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";

const updatedAppConfig = {
    ...appConfig,
    providers: [
        ...(appConfig.providers || []),
        provideHttpClient()
    ]
};



bootstrapApplication(AppComponent, updatedAppConfig).catch(err => console.error(err));
