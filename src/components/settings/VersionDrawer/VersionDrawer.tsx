"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Symbol from "@/components/controls/Symbol/Symbol";
import { List, ListRow } from "@/components/ui/list";
import { SectionCard } from "@/components/ui/sectioncard";

export default function VersionDrawer() {
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
		<SectionCard background="surface" title="Version" symbolName="hammer">
			<List>
				<ListRow>
					<span>Client</span>
					<strong>{version}</strong>
				</ListRow>
			</List>
			<Button
				aria-label="Copy version"
				variant="secondary"
				onClick={() => void copy()}
			>
				<Symbol name="doc.on.doc" fallback="+" />
				{copied ? "Copied" : "Copy Version"}
			</Button>
		</SectionCard>
	);
}
