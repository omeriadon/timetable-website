"use client";

import { useState } from "react";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

export default function VersionSheet() {
	const { closeSheet } = useSheet();
	const [copied, setCopied] = useState(false);
	const version = "Web";

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(version);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<SymbolIcon name="hammer" fallback="+" />
				</div>
				<div>
					<h2>Version</h2>
					<p>{version}</p>
				</div>
			</header>
			<SheetActionButton label="Copy version" onClick={() => void copy()}>
				<SymbolIcon name="doc.on.doc" fallback="+" />
				{copied ? "Copied" : "Copy Version"}
			</SheetActionButton>
			<SheetActionButton label="Close version" onClick={closeSheet}>
				<SymbolIcon name="xmark" fallback="x" />
				Close
			</SheetActionButton>
		</div>
	);
}
