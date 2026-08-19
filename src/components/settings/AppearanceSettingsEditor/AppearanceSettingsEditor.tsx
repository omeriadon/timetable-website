"use client";

import { Select } from "@/components/ui/Select";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { Settings } from "@/features/settings/types";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

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
			<section className={styles.card}>
				<div className={styles.row}>
					<Symbol name="textformat.size" />
					<label className={styles.label} htmlFor="app-font-design">
						App Font
					</label>
					<Select
						id="app-font-design"
						className={styles.inlineSelect}
						value={draft.appFontDesign}
						disabled={saving}
						onChange={(event) =>
							void save({ appFontDesign: event.target.value })
						}
					>
						<option value="monospaced">Monospaced</option>
						<option value="rounded">Rounded</option>
						<option value="expanded">Expanded</option>
					</Select>
				</div>
				<div className={styles.row}>
					<Symbol name="paintpalette" />
					<label className={styles.label} htmlFor="app-background">
						Background
					</label>
					<Select
						id="app-background"
						className={styles.inlineSelect}
						value={draft.appBackground}
						disabled={saving}
						onChange={(event) =>
							void save({ appBackground: event.target.value })
						}
					>
						<option value="solid">Solid</option>
						<option value="paper">Paper</option>
					</Select>
				</div>
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}
