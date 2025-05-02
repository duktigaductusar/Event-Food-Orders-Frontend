export function getShortTitle(title: string): string {
	return title.length > 200 ? title.substring(0, 200) + "…" : title;
}
