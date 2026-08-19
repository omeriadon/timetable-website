"use client";

import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

type MessageSheetProps = {
	title: string;
	message: string;
	tone?: "info" | "error";
};

export default function MessageSheet({
	title,
	message,
	tone = "error",
}: MessageSheetProps) {
	const { closeSheet } = useSheet();

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<SymbolIcon
					name={tone === "error" ? "exclamationmark.triangle" : "info.circle"}
					fallback={tone === "error" ? "!" : "i"}
				/>
				<div>
					<h2>{title}</h2>
					<p>{message}</p>
				</div>
			</header>
			<div className={styles.sheetActions}>
				<SheetActionButton label="Close" onClick={closeSheet}>
					<SymbolIcon name="checkmark" fallback="✓" />
					Close
				</SheetActionButton>
			</div>
		</div>
	);
}
