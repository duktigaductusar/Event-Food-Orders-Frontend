export const environment = {
	production: false,
	apiUrl: "http://localhost:8080/api",
	baseUrl: "http://localhost",
	azureAd: {
		clientId: "818188f3-6c98-4bed-8a82-74454065975b",
		authority:
			"https://login.microsoftonline.com/f84f6fe6-b0e4-4db1-b7d6-b7c280fb507f",
		redirectUri: "http://localhost:4200/",
		loginRedirectUri: "http://localhost:4200/auth-callback",
	},
};
