"use client";

import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { List, ListRow } from "@/components/ui/list";

const leadTimes = [0, 1, 2, 3, 5, 10];

export type NotificationLeadTimesDrawerProps = {
	title: string;
	description?: string;
	selection: number[];
	onSave: (selection: number[]) => Promise<void>;
};

export default function NotificationLeadTimesDrawer({
	title,
	description,
	selection,
	onSave,
}: NotificationLeadTimesDrawerProps) {
	const { closeDrawer } = useDrawer();
	const [draft, setDraft] = useState(() => new Set(selection));
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggle = (value: number) => {
		setDraft((current) => {
			const next = new Set(current);
			if (next.has(value)) {
				next.delete(value);
			} else {
				next.add(value);
			}
			return next;
		});
	};

	const save = async () => {
		if (saving) {
			return;
		}
		setSaving(true);
		setError(null);
		try {
			await onSave([...draft].sort((left, right) => left - right));
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			<header>
				<h2>{title}</h2>
				{description ? (
					<p className={styles.detailMuted}>{description}</p>
				) : null}
			</header>
			<List>
				{leadTimes.map((value) => {
					const selected = draft.has(value);
					return (
						<Button
							key={value}
							type="button"
							className={
								selected ? styles.leadTimeOptionActive : styles.leadTimeOption
							}
							onClick={() => toggle(value)}
							aria-pressed={selected}
						>
							<ListRow>
								<span className={styles.leadTimeLabel}>
									{value} {value === 1 ? "minute" : "minutes"} early
								</span>
								{selected ? (
									<Symbol
										name="checkmark"
										fallback="✓"
										className={styles.selectionCheck}
									/>
								) : null}
							</ListRow>
						</Button>
					);
				})}
			</List>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<DrawerFooter>
				<Button
					aria-label="Save notification lead times"
					onClick={() => void save()}
					disabled={saving}
				>
					<Symbol name="checkmark" fallback="✓" />
					{saving ? "Saving…" : "Save"}
				</Button>
			</DrawerFooter>
		</div>
	);
}
