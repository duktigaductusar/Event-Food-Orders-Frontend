// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = tseslint.config(
	{
		ignores: ["node_modules/", "dist/", ".angular/cache/"],
		files: ["src/**/*.ts"],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylistic,
			...angular.configs.tsRecommended,
		],
		plugins: {
			prettier: prettierPlugin,
		},
		processor: angular.processInlineTemplates,
		rules: {
			"@angular-eslint/directive-selector": [
				"error",
				{
					type: "attribute",
					prefix: "app",
					style: "camelCase",
				},
			],
			"@angular-eslint/component-selector": [
				"error",
				{
					type: "element",
					prefix: "app",
					style: "kebab-case",
				},
			],
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	{
		ignores: ["node_modules/", "dist/", ".angular/cache/"],
		files: ["src/**/*.html"],
		extends: [
			...angular.configs.templateRecommended,
			...angular.configs.templateAccessibility,
		],
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			"prettier/prettier": [
				"error",
				{
					parser: "angular",
				},
			],
			"@angular-eslint/template/click-events-have-key-events": "warn",
			"@angular-eslint/template/interactive-supports-focus": "warn",
		},
	}
);
