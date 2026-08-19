"use client";

import { useState } from "react";
import { Button } from "@base-ui/react/button";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

export default function VersionDrawer() {
	const { closeDrawer } = useDrawer();
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
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<Symbol name="hammer" fallback="+" />
				</div>
				<div>
					<h2>Version</h2>
					<p>{version}</p>
				</div>
			</header>
			<Button aria-label="Copy version" onClick={() => void copy()}>
				<Symbol name="doc.on.doc" fallback="+" />
				{copied ? "Copied" : "Copy Version"}
			</Button>
			<Button aria-label="Close version" onClick={closeDrawer}>
				<Symbol name="xmark" fallback="x" />
				Close
			</Button>
		</div>
	);
}
