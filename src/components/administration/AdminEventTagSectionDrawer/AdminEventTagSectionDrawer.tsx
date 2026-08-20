"use client";

import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { useState } from "react";
import type {
	AdminEventTagSection,
	Catalogue,
} from "@/components/administration/AdminEventTagsEditor/AdminEventTagsEditor";
import { Button } from "@base-ui/react/button";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

type AdminEventTagSectionDrawerProps = {
	section: AdminEventTagSection;
	onSaved: (catalogue: Catalogue) => void;
};

export default function AdminEventTagSectionDrawer({
	section,
	onSaved,
}: AdminEventTagSectionDrawerProps) {
	const { closeDrawer } = useDrawer();
	const [displayName, setDisplayName] = useState(section.displayName);
	const [sortOrder, setSortOrder] = useState(String(section.sortOrder));
	const [isArchived, setIsArchived] = useState(section.isArchived);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async () => {
		if (!displayName.trim() || saving) {
			return;
		}

		setSaving(true);
		setError(null);

		try {
			const catalogue = await apiRequest<Catalogue>(
				`v1/administration/event-tags/sections/${section.id}`,
				{
					method: "PUT",
					body: JSON.stringify({
						displayName: displayName.trim(),
						sortOrder: Number(sortOrder) || 0,
						isArchived,
					}),
				},
			);
			onSaved(catalogue);
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<Symbol name="tag" />
				<div>
					<h2>Edit Section</h2>
					<p>{section.category}</p>
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
					Sort Order
					<Input
						type="number"
						min="0"
						value={sortOrder}
						onChange={(event) => setSortOrder(event.target.value)}
					/>
				</label>
				<label className={styles.editorCheck}>
					<Checkbox
						aria-label="Archive section"
						checked={isArchived}
						onCheckedChange={setIsArchived}
					/>
					Archive section
				</label>
				<div className={styles.drawerActions}>
					<Button
						aria-label="Cancel section edit"
						onClick={closeDrawer}
						disabled={saving}
					>
						Cancel
					</Button>
					<Button
						aria-label="Save event tag section"
						onClick={() => void save()}
						disabled={saving || !displayName.trim()}
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
