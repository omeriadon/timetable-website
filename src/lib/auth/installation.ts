const installationKey = "timetable.website.installation-id";

export function websiteInstallationID(): string {
	const existing = window.localStorage.getItem(installationKey);

	if (existing) {
		return existing;
	}

	const installationID = crypto.randomUUID();
	window.localStorage.setItem(installationKey, installationID);
	return installationID;
}
