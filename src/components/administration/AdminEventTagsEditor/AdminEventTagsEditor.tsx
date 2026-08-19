"use client";

import { Button } from "@base-ui/react/button";
import { useEffect, useState } from "react";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import actionStyles from "@/components/ui/ContentActions.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import AdminEventTagDrawer from "../AdminEventTagDrawer/AdminEventTagDrawer";
import AdminEventTagSectionDrawer from "../AdminEventTagSectionDrawer/AdminEventTagSectionDrawer";

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

export type Catalogue = { sections: AdminEventTagSection[] };

export default function AdminEventTagsEditor() {
	const { openDrawer } = useDrawer();
	const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isReordering, setIsReordering] = useState(false);
	const load = () =>
		apiRequest<Catalogue>("v1/administration/event-tags")
			.then(setCatalogue)
			.catch((requestError: Error) => setError(requestError.message));
	useEffect(() => {
		void load();
	}, []);
	const edit = (tag: AdminEventTag | null, section: AdminEventTagSection) =>
		openDrawer(
			<AdminEventTagDrawer
				tag={tag}
				section={section}
				onSaved={() => {
					void load();
				}}
			/>,
		);
	const editSection = (section: AdminEventTagSection) =>
		openDrawer(
			<AdminEventTagSectionDrawer section={section} onSaved={setCatalogue} />,
		);

	const moveTag = async (tagID: string, offset: -1 | 1) => {
		if (!catalogue) {
			return;
		}

		const tags = catalogue.sections
			.flatMap((section) => section.tags)
			.slice()
			.sort((left, right) => left.sortOrder - right.sortOrder);
		const currentIndex = tags.findIndex((tag) => tag.id === tagID);
		const nextIndex = currentIndex + offset;

		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= tags.length) {
			return;
		}

		const reordered = tags.slice();
		const [moved] = reordered.splice(currentIndex, 1);
		reordered.splice(nextIndex, 0, moved);
		setError(null);

		try {
			const updated = await apiRequest<Catalogue>(
				"v1/administration/event-tags/order",
				{
					method: "PUT",
					body: JSON.stringify({ tagIDs: reordered.map((tag) => tag.id) }),
				},
			);
			setCatalogue(updated);
		} catch (requestError) {
			setError((requestError as Error).message);
		}
	};

	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<div className={adminStyles.adminToolbar}>
				<Button
					type="button"
					className={actionStyles.action}
					onClick={() => setIsReordering((value) => !value)}
				>
					<Symbol name={isReordering ? "checkmark" : "arrow.up.arrow.down"} />
					<span>{isReordering ? "Done" : "Reorder"}</span>
				</Button>
			</div>
			{catalogue?.sections.map((section) => (
				<section key={section.id}>
					<Button
						type="button"
						className={adminStyles.sectionButton}
						onClick={() => editSection(section)}
						aria-label={`Edit ${section.displayName} section`}
					>
						<h2 className={styles.section}>{section.displayName}</h2>
					</Button>
					<div className={styles.card}>
						{section.tags.map((tag) => (
							<div key={tag.id} className={adminStyles.rowWithAction}>
								<Button
									type="button"
									className={styles.rowButton}
									onClick={() => edit(tag, section)}
								>
									<div className={styles.row}>
										<Symbol name={tag.symbol ?? "tag"} fallback="#" />
										<span>
											<b className={styles.label}>{tag.displayName}</b>
											<small className={styles.rowMeta}>
												{tag.slug}
												{tag.isArchived ? " · Archived" : ""}
											</small>
										</span>
										<Symbol
											name="chevron.right"
											className={styles.chevronIcon}
										/>
									</div>
								</Button>
								{isReordering ? (
									<div className={adminStyles.reorderButtons}>
										<Button
											type="button"
											onClick={() => void moveTag(tag.id, -1)}
											aria-label={`Move ${tag.displayName} up`}
										>
											<span aria-hidden="true">↑</span>
										</Button>
										<Button
											type="button"
											onClick={() => void moveTag(tag.id, 1)}
											aria-label={`Move ${tag.displayName} down`}
										>
											<span aria-hidden="true">↓</span>
										</Button>
									</div>
								) : null}
							</div>
						))}
						<Button
							type="button"
							className={styles.rowButton}
							onClick={() => edit(null, section)}
						>
							<div className={styles.row}>
								<Symbol name="plus" fallback="＋" />
								<span className={styles.label}>Add Tag</span>
							</div>
						</Button>
					</div>
				</section>
			))}
			{!catalogue && !error ? (
				<p className={styles.loading}>Loading event tags…</p>
			) : null}
		</main>
	);
}
