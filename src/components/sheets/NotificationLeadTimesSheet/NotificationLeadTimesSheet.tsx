"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/sheets/Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";

const leadTimes = [0, 1, 2, 3, 5, 10];

export type NotificationLeadTimesSheetProps = {
	title: string;
	description?: string;
	selection: number[];
	onSave: (selection: number[]) => Promise<void>;
};

export default function NotificationLeadTimesSheet({
	title,
	description,
	selection,
	onSave,
}: NotificationLeadTimesSheetProps) {
	const { closeSheet } = useSheet();
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
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header>
				<h2>{title}</h2>
				{description ? (
					<p className={styles.detailMuted}>{description}</p>
				) : null}
			</header>
			<section className={styles.detailCard} aria-label={title}>
				{leadTimes.map((value) => {
					const selected = draft.has(value);
					return (
						<Button
							unstyled
							key={value}
							type="button"
							className={
								selected ? styles.leadTimeOptionActive : styles.leadTimeOption
							}
							onClick={() => toggle(value)}
							aria-pressed={selected}
						>
							<span>
								{value} {value === 1 ? "minute" : "minutes"} early
							</span>
							{selected ? <SymbolIcon name="checkmark" fallback="✓" /> : null}
						</Button>
					);
				})}
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.sheetActions}>
				<SheetActionButton
					label="Save notification lead times"
					onClick={() => void save()}
					disabled={saving}
				>
					<SymbolIcon name="checkmark" fallback="✓" />
					{saving ? "Saving…" : "Save"}
				</SheetActionButton>
			</div>
		</div>
	);
}
