import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	useContext,
	type JSX,
} from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import styles from "./StatusBadge.module.css";

export type StatusBadgeKind =
	"progress" | "success" | "info" | "warning" | "error";
type StatusBadge = {
	id: number;
	title: string;
	secondaryText?: string;
	kind: StatusBadgeKind;
};
type ContextValue = {
	addStatusBadge: (badge: Omit<StatusBadge, "id">) => void;
};
const Context = createContext<ContextValue>();

export function StatusBadgeProvider(props: { children: JSX.Element }) {
	const [badge, setBadge] = createSignal<StatusBadge | null>(null);
	const addStatusBadge = (next: Omit<StatusBadge, "id">) =>
		setBadge({ ...next, id: Date.now() });
	createEffect(() => {
		const current = badge();
		if (!current || current.kind === "progress") return;
		const timeout = window.setTimeout(() => setBadge(null), 5000);
		onCleanup(() => window.clearTimeout(timeout));
	});
	return (
		<Context.Provider value={{ addStatusBadge }}>
			{props.children}
			{badge() ? (
				<div
					class={styles.overlay}
					role={badge()!.kind === "error" ? "alert" : "status"}
					aria-live="polite"
				>
					<div class={styles.badge} data-kind={badge()!.kind}>
						<Symbol name={statusSymbol(badge()!.kind)} class={styles.icon} />
						<div class={styles.copy}>
							<strong>{badge()!.title}</strong>
							{badge()!.secondaryText ? (
								<span>{badge()!.secondaryText}</span>
							) : null}
						</div>
						<Button
							type="button"
							variant="ghost"
							class={styles.dismiss}
							aria-label="Dismiss status"
							onClick={() => setBadge(null)}
						>
							<Symbol name="xmark" />
						</Button>
					</div>
				</div>
			) : null}
		</Context.Provider>
	);
}

export function useStatusBadge() {
	const context = useContext(Context);
	if (!context)
		throw new Error("useStatusBadge must be used inside StatusBadgeProvider");
	return context;
}

function statusSymbol(kind: StatusBadgeKind) {
	return {
		progress: "arrow.trianglehead.2.clockwise.rotate.90",
		success: "checkmark.circle",
		warning: "exclamationmark.triangle",
		error: "xmark.circle",
		info: "info.circle",
	}[kind];
}
