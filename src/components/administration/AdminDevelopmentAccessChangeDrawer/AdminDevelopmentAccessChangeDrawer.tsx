import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

export default function AdminDevelopmentAccessChangeDrawer({
	enabled,
	onSaved,
}: {
	enabled: boolean;
	onSaved: (enabled: boolean) => void;
}) {
	const { closeDrawer } = useDrawer();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const nextValue = !enabled;

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			const response = await apiRequest<{ developmentAccessOnly: boolean }>(
				"_operations/server-access-mode",
				{
					method: "PUT",
					body: JSON.stringify({ developmentAccessOnly: nextValue }),
				},
			);
			onSaved(response.developmentAccessOnly);
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
				<Symbol name={nextValue ? "lock.fill" : "lock.open"} fallback="▣" />
				<div>
					<h2>
						{nextValue ? "Restrict Server Access?" : "Restore Normal Access?"}
					</h2>
					<p>Development Access</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<p className={styles.detailMuted}>
					{nextValue
						? "Only system administrators will be able to use the server. Existing sessions remain intact."
						: "All accounts will be able to use the server again."}
				</p>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<DrawerFooter className={styles.actionFooter}>
				<DrawerClose
					variant="outline"
					flexible
					disabled={saving}
					aria-label="Cancel server access change"
				>
					Cancel
				</DrawerClose>
				<Button
					flexible
					aria-label={nextValue ? "Restrict access" : "Restore access"}
					onClick={() => void save()}
					disabled={saving}
				>
					{saving
						? "Saving…"
						: nextValue
							? "Restrict Access"
							: "Restore Access"}
				</Button>
			</DrawerFooter>
		</div>
	);
}
