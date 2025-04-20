export const environment = {
	production: true,
	allowedEmailDomains: ["ductus.se"],
	defaultDeadline: 1,
	apiUrl: "https://api.duktiga-ductusar.online/api",
	azureAd: {
		clientId: "3049ab04-0e32-4c6b-99ed-020071d7b4ad",
		apiId: "818188f3-6c98-4bed-8a82-74454065975b",
		authority:
			"https://login.microsoftonline.com/f84f6fe6-b0e4-4db1-b7d6-b7c280fb507f",
		loginRedirectUri: "https://app.duktiga-ductusar.online/",
		logoutRedirectUri: "https://app.duktiga-ductusar.online/logout-success",
	},
};

// export const environment = {
// 	production: true,
// 	allowedEmailDomains: ["ductus.se"],
// 	defaultDeadline: 1,
// 	apiUrl: "https://efobackend.lulea.ductus.se/api",
// 	azureAd: {
// 		clientId: "3049ab04-0e32-4c6b-99ed-020071d7b4ad",
// 		apiId: "818188f3-6c98-4bed-8a82-74454065975b",
// 		authority:
// 			"https://login.microsoftonline.com/f84f6fe6-b0e4-4db1-b7d6-b7c280fb507f",
// 		loginRedirectUri: "https://efo.lulea.ducteas.se/",
// 		logoutRedirectUri: "http://efo.lulea.ducteas.se/logout-success",
// 	},
// };
