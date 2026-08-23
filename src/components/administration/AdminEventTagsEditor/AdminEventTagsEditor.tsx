"use client";

import { useEffect, useState } from "react";

import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { Button } from "@/components/ui/button";
import { List, ListRow } from "@/components/ui/list";
import { apiRequest } from "@/lib/api/client";

import AdminEventTagDrawer from "../AdminEventTagDrawer/AdminEventTagDrawer";
import AdminEventTagSectionDrawer from "../AdminEventTagSectionDrawer/AdminEventTagSectionDrawer";

import styles from "@/components/administration/Administration.module.css";

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

export type Catalogue = {
	sections: AdminEventTagSection[];
};

export default function AdminEventTagsEditor() {
	const { openDrawer } = useDrawer();

	const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isReordering, setIsReordering] = useState(false);
	const [saving, setSaving] = useState(false);

	const load = async () => {
		setError(null);

		try {
			setCatalogue(await apiRequest<Catalogue>("v1/administration/event-tags"));
		} catch (requestError) {
			setError((requestError as Error).message);
		}
	};

	useEffect(() => {
		void load();
	}, []);

	const editTag = (
		tag: AdminEventTag | null,
		section: AdminEventTagSection,
	) => {
		openDrawer(
			<AdminEventTagDrawer
				tag={tag}
				section={section}
				onSaved={() => void load()}
			/>,
		);
	};

	const editSection = (section: AdminEventTagSection) => {
		openDrawer(
			<AdminEventTagSectionDrawer section={section} onSaved={setCatalogue} />,
		);
	};

	const moveTag = async (tagID: string, offset: -1 | 1) => {
		if (!catalogue || saving) return;

		const tags = catalogue.sections
			.flatMap((section) => section.tags)
			.toSorted((left, right) => left.sortOrder - right.sortOrder);

		const currentIndex = tags.findIndex((tag) => tag.id === tagID);
		const nextIndex = currentIndex + offset;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= tags.length) return;

		const reordered = [...tags];
		const [moved] = reordered.splice(currentIndex, 1);

		if (!moved) return;

		reordered.splice(nextIndex, 0, moved);

		setSaving(true);
		setError(null);

		try {
			const updated = await apiRequest<Catalogue>(
				"v1/administration/event-tags/order",
				{
					method: "PUT",
					body: JSON.stringify({
						tagIDs: reordered.map((tag) => tag.id),
					}),
				},
			);

			setCatalogue(updated);
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			{error && (
				<p className={styles.error} role="alert">
					{error}
				</p>
			)}

			<div className={styles.adminToolbar}>
				<Button
					type="button"
					variant="outline"
					onClick={() => setIsReordering((value) => !value)}
					aria-pressed={isReordering}
				>
					<Symbol name={isReordering ? "checkmark" : "arrow.up.arrow.down"} />
					{isReordering ? "Done" : "Reorder"}
				</Button>
			</div>

			{catalogue?.sections.map((section) => (
				<section key={section.id}>
					<Button
						type="button"
						variant="ghost"
						className={styles.sectionButton}
						onClick={() => editSection(section)}
						aria-label={`Edit ${section.displayName} section`}
					>
						<h2 className={styles.section}>{section.displayName}</h2>
					</Button>

					<List rowHover>
						{section.tags.map((tag) => (
							<ListRow key={tag.id} className={styles.rowWithAction}>
								<Button
									type="button"
									variant="ghost"
									className={styles.listButton}
									onClick={() => editTag(tag, section)}
									aria-label={`Edit ${tag.displayName}`}
								>
									<ListRow>
										<Symbol name={tag.symbol ?? "tag"} fallback="#" />

										<span>
											<b className={styles.label}>{tag.displayName}</b>
											<small className={styles.detail}>
												{tag.slug}
												{tag.isArchived ? " · Archived" : ""}
											</small>
										</span>

										<Symbol name="chevron.right" />
									</ListRow>
								</Button>

								{isReordering && (
									<div className={styles.reorderButtons}>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => void moveTag(tag.id, -1)}
											disabled={saving}
											aria-label={`Move ${tag.displayName} up`}
										>
											<Symbol name="chevron.up" fallback="↑" />
										</Button>

										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => void moveTag(tag.id, 1)}
											disabled={saving}
											aria-label={`Move ${tag.displayName} down`}
										>
											<Symbol name="chevron.down" fallback="↓" />
										</Button>
									</div>
								)}
							</ListRow>
						))}

						<Button
							type="button"
							variant="ghost"
							className={styles.listButton}
							onClick={() => editTag(null, section)}
						>
							<ListRow>
								<Symbol name="plus" fallback="＋" />
								<span className={styles.label}>Add Tag</span>
							</ListRow>
						</Button>
					</List>
				</section>
			))}

			{!catalogue && !error && (
				<p className={styles.loading}>Loading event tags…</p>
			)}
		</main>
	);
}
