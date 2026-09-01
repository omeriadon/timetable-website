import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";

type ConfirmationDrawerProps = {
	title: string;
	message: string;
	confirmLabel: string;
	icon?: string;
	tone?: "prominent" | "destructive";
	onConfirm: () => void | Promise<void>;
};

export default function ConfirmationDrawer({
	title,
	message,
	confirmLabel,
	icon = "exclamationmark.triangle",
	tone = "destructive",
	onConfirm,
}: ConfirmationDrawerProps) {
	const { closeDrawer } = useDrawer();
	const [isWorking, setIsWorking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const confirm = async () => {
		if (isWorking) return;
		setIsWorking(true);
		setError(null);
		try {
			await onConfirm();
			closeDrawer();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "The action could not be completed.",
			);
			setIsWorking(false);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<Symbol name={icon} fallback="!" />
				<div>
					<h2>{title}</h2>
					<p>{message}</p>
				</div>
			</header>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<DrawerFooter className={styles.actionFooter}>
				<DrawerClose variant="outline" flexible disabled={isWorking}>
					<Symbol name="xmark" fallback="×" />
					Cancel
				</DrawerClose>
				<Button
					variant={tone === "destructive" ? "destructive" : "default"}
					flexible
					aria-label={confirmLabel}
					onClick={() => void confirm()}
					disabled={isWorking}
				>
					<Symbol
						name={tone === "destructive" ? "trash" : "checkmark"}
						fallback={tone === "destructive" ? "×" : "✓"}
					/>
					{isWorking ? "Working…" : confirmLabel}
				</Button>
			</DrawerFooter>
		</div>
	);
}
