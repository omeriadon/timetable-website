import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { createSignal } from "solid-js";
import type {
	AdminEventTagSection,
	Catalogue,
} from "@/components/administration/AdminEventTagsEditor/AdminEventTagsEditor";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
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
	const [displayName, setDisplayName] = createSignal(section.displayName);
	const [sortOrder, setSortOrder] = createSignal(String(section.sortOrder));
	const [isArchived, setIsArchived] = createSignal(section.isArchived);
	const [saving, setSaving] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);

	const save = async () => {
		if (!displayName().trim() || saving()) {
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
						displayName: displayName().trim(),
						sortOrder: Number(sortOrder()) || 0,
						isArchived: isArchived(),
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
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<Symbol name="tag" />
				<div>
					<h2>Edit Section</h2>
					<p>{section.category}</p>
				</div>
			</header>
			<section class={styles.formCard}>
				<label>
					Display Name
					<Input
						value={displayName()}
						onChange={(event) => setDisplayName(event.target.value)}
					/>
				</label>
				<label>
					Sort Order
					<Input
						type="number"
						min="0"
						value={sortOrder()}
						onChange={(event) => setSortOrder(event.target.value)}
					/>
				</label>
				<label class={styles.editorCheck}>
					<Toggle
						aria-label="Archive section"
						checked={isArchived()}
						onCheckedChange={setIsArchived}
					/>
					Archive section
				</label>
			</section>
			{error() ? (
				<p class={styles.detailMuted} role="alert">
					{error()}
				</p>
			) : null}
			<DrawerFooter class={styles.actionFooter}>
				<DrawerClose
					variant="outline"
					flexible
					disabled={saving()}
					aria-label="Cancel section edit"
				>
					Cancel
				</DrawerClose>
				<Button
					flexible
					aria-label="Save event tag section"
					onClick={() => void save()}
					disabled={saving() || !displayName().trim()}
				>
					{saving() ? "Saving…" : "Save"}
				</Button>
			</DrawerFooter>
		</div>
	);
}
