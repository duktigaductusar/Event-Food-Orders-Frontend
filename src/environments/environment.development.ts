export const environment = {
	production: false,
	apiUrl: "http://localhost:8080/api",
	baseUrl: "http://localhost:",
	azureAd: {
		clientId: "3049ab04-0e32-4c6b-99ed-020071d7b4ad",
		apiId: "818188f3-6c98-4bed-8a82-74454065975b",
		authority:
			"https://login.microsoftonline.com/f84f6fe6-b0e4-4db1-b7d6-b7c280fb507f",
		loginRedirectUri: "http://localhost:4200/",
		logoutRedirectUri: "http://localhost:4200/login"
	},
};
