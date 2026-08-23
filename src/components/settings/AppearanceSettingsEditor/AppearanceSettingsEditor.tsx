"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { Settings } from "@/features/settings/types";
import { List, ListRow } from "@/components/ui/list";
import styles from "@/components/settings/Settings.module.css";

export default function AppearanceSettingsEditor({
	initial,
}: {
	initial: Settings;
}) {
	const [draft, setDraft] = useState(initial);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async (changes: Partial<Settings>) => {
		const previous = draft;
		const next = { ...draft, ...changes };
		setDraft(next);
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<Settings>("v1/settings", {
				method: "PUT",
				body: JSON.stringify({
					...next,
					serverRevision: previous.serverRevision,
				}),
			});
			setDraft(updated);
			window.dispatchEvent(
				new CustomEvent("timetable:theme", { detail: updated }),
			);
		} catch (requestError) {
			setDraft(previous);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<List rowHover>
				<ListRow>
					<Symbol name="textformat.size" />
					<label className={styles.label} htmlFor="app-font-design">
						App Font
					</label>
					<Select
						value={draft.appFontDesign}
						disabled={saving}
						onValueChange={(value) => {
							if (value !== null) {
								void save({ appFontDesign: value });
							}
						}}
					>
						<SelectTrigger id="app-font-design" aria-label="App Font">
							<SelectValue>
								{appFontDesignLabel(draft.appFontDesign)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="monospaced">Monospaced</SelectItem>
							<SelectItem value="rounded">Rounded</SelectItem>
							<SelectItem value="expanded">Expanded</SelectItem>
						</SelectContent>
					</Select>
				</ListRow>
			</List>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}

function appFontDesignLabel(value: string) {
	switch (value) {
		case "monospaced":
			return "Monospaced";
		case "rounded":
			return "Rounded";
		case "expanded":
			return "Expanded";
		default:
			return value;
	}
}
