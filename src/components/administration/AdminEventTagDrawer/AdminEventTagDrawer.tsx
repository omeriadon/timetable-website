"use client";

import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type {
	AdminEventTag,
	AdminEventTagSection,
} from "../AdminEventTagsEditor/AdminEventTagsEditor";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";

export default function AdminEventTagDrawer({
	tag,
	section,
	onSaved,
}: {
	tag: AdminEventTag | null;
	section: AdminEventTagSection;
	onSaved: () => void;
}) {
	const { closeDrawer } = useDrawer();
	const [displayName, setDisplayName] = useState(tag?.displayName ?? "");
	const [slug, setSlug] = useState(tag?.slug ?? "");
	const [symbol, setSymbol] = useState(tag?.symbol ?? "tag");
	const [colorHex, setColorHex] = useState(tag?.colorHex ?? "#BD3547");
	const [isArchived, setIsArchived] = useState(tag?.isArchived ?? false);
	const [associatedNames, setAssociatedNames] = useState(
		tag?.associatedNames.join("\n") ?? "",
	);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			await apiRequest(
				`v1/administration/event-tags${tag ? `/${tag.id}` : ""}`,
				{
					method: tag ? "PUT" : "POST",
					body: JSON.stringify({
						sectionID: section.id,
						slug: slug.trim(),
						displayName: displayName.trim(),
						symbol: symbol.trim() || null,
						colorHex,
						sortOrder: tag?.sortOrder ?? section.tags.length,
						isArchived,
						associatedNames: associatedNames
							.split(/\r?\n/)
							.map((value) => value.trim())
							.filter(Boolean),
					}),
				},
			);
			onSaved();
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};
	const remove = async () => {
		if (!tag) return;
		setSaving(true);
		try {
			await apiRequest(`v1/administration/event-tags/${tag.id}`, {
				method: "DELETE",
			});
			onSaved();
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
			setSaving(false);
		}
	};
	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div>
					<h2>{tag ? "Edit Tag" : "Add Tag"}</h2>
					<p>{section.displayName}</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Display Name
					<Input
						value={displayName}
						onChange={(event) => setDisplayName(event.target.value)}
					/>
				</label>
				<label>
					Slug
					<Input
						value={slug}
						onChange={(event) => setSlug(event.target.value)}
					/>
				</label>
				<label>
					Symbol
					<Input
						value={symbol}
						onChange={(event) => setSymbol(event.target.value)}
					/>
				</label>
				<label>
					Colour
					<Input
						type="color"
						value={colorHex}
						onChange={(event) => setColorHex(event.target.value)}
					/>
				</label>
				<label>
					Associated Names
					<Textarea
						rows={3}
						value={associatedNames}
						onChange={(event) => setAssociatedNames(event.target.value)}
					/>
				</label>
				<label className={styles.editorCheck}>
					<Toggle
						aria-label="Archive tag"
						checked={isArchived}
						onCheckedChange={setIsArchived}
					/>{" "}
					Archive tag
				</label>
				<div className={styles.drawerActions}>
					{tag ? (
						<Button
							aria-label="Delete event tag"
							onClick={() => void remove()}
							disabled={saving}
						>
							Delete
						</Button>
					) : null}
					<Button
						aria-label="Save event tag"
						onClick={() => void save()}
						disabled={saving || !displayName.trim() || !slug.trim()}
					>
						{saving ? "Saving…" : "Save"}
					</Button>
				</div>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}
