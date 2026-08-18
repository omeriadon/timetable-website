"use client";

import { useEffect, useState } from "react";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import AdminEventTagSheet from "../AdminEventTagSheet/AdminEventTagSheet";

export type AdminEventTag = {
	id: string;
	sectionID: string;
	slug: string;
	displayName: string;
	category: string;
	symbol?: string | null;
	colorHex?: string | null;
	sortOrder: number;
	isArchived: boolean;
	revision: number;
	associatedNames: string[];
};

export type AdminEventTagSection = {
	id: string;
	category: string;
	displayName: string;
	sortOrder: number;
	isArchived: boolean;
	revision: number;
	tags: AdminEventTag[];
};

type Catalogue = { sections: AdminEventTagSection[] };

export default function AdminEventTagsEditor() {
	const { openSheet } = useSheet();
	const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
	const [error, setError] = useState<string | null>(null);
	const load = () => apiRequest<Catalogue>("v1/administration/event-tags").then(setCatalogue).catch((requestError: Error) => setError(requestError.message));
	useEffect(() => { void load(); }, []);
	const edit = (tag: AdminEventTag | null, section: AdminEventTagSection) => openSheet(<AdminEventTagSheet tag={tag} section={section} onSaved={() => { void load(); }} />);
	return (
		<main className={styles.page}>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
			{catalogue?.sections.map((section) => (
				<section key={section.id}>
					<h2 className={styles.section}>{section.displayName}</h2>
					<div className={styles.card}>
						{section.tags.map((tag) => <button key={tag.id} type="button" className={styles.rowButton} onClick={() => edit(tag, section)}><div className={styles.row}><SymbolIcon name={tag.symbol ?? "tag"} fallback="#" /><span><b className={styles.label}>{tag.displayName}</b><small style={{ display: "block", color: "var(--theme-text-secondary)" }}>{tag.slug}{tag.isArchived ? " · Archived" : ""}</small></span><span className={styles.chevron}>›</span></div></button>)}
						<button type="button" className={styles.rowButton} onClick={() => edit(null, section)}><div className={styles.row}><SymbolIcon name="plus" fallback="＋" /><span className={styles.label}>Add Tag</span></div></button>
					</div>
				</section>
			))}
			{!catalogue && !error ? <p className={styles.loading}>Loading event tags…</p> : null}
		</main>
	);
}
