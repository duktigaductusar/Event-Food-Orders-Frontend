export const environment = {
	production: false,
	defaultDeadline: 1,
	apiUrl: "https://api.duktiga-ductusar.online/api",
	baseUrl: "https://api.duktiga-ductusar.online",
	azureAd: {
		clientId: "3049ab04-0e32-4c6b-99ed-020071d7b4ad",
		authority:
			"https://login.microsoftonline.com/f84f6fe6-b0e4-4db1-b7d6-b7c280fb507f",
		loginRedirectUri: "http://localhost:4200/",
		logoutRedirectUri: "http://localhost:4200/login",
	},
};
