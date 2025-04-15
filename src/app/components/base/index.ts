export * from "./app-base.component";
export * from "./form-auto-saver.component";

// OBS! Do not export AppCSSClassComponent here, this will cause
// null-pointer injection issue when angular build the project.
// The core problem could be that angular directives may not
// be intended to extend.
// TODO! If possible fix this issue.
