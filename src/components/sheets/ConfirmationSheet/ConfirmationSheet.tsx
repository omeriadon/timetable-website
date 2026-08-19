"use client";

import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

type ConfirmationSheetProps = {
	title: string;
	message: string;
	confirmLabel: string;
	icon?: string;
	tone?: "prominent" | "destructive";
	onConfirm: () => void | Promise<void>;
};

export default function ConfirmationSheet({
	title,
	message,
	confirmLabel,
	icon = "exclamationmark.triangle",
	tone = "destructive",
	onConfirm,
}: ConfirmationSheetProps) {
	const { closeSheet } = useSheet();
	const [isWorking, setIsWorking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const confirm = async () => {
		if (isWorking) return;
		setIsWorking(true);
		setError(null);
		try {
			await onConfirm();
			closeSheet();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "The action could not be completed.",
			);
			setIsWorking(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<Symbol name={icon} fallback="!" />
				<div>
					<h2>{title}</h2>
					<p>{message}</p>
				</div>
			</header>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.sheetActions}>
				<SheetActionButton
					label="Cancel"
					tone="prominent"
					onClick={closeSheet}
					disabled={isWorking}
				>
					<Symbol name="xmark" fallback="×" />
					Cancel
				</SheetActionButton>
				<SheetActionButton
					label={confirmLabel}
					tone={tone}
					onClick={() => void confirm()}
					disabled={isWorking}
				>
					<Symbol
						name={tone === "destructive" ? "trash" : "checkmark"}
						fallback={tone === "destructive" ? "×" : "✓"}
					/>
					{isWorking ? "Working…" : confirmLabel}
				</SheetActionButton>
			</div>
		</div>
	);
}
