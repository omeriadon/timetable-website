"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import styles from "./StatusBadge.module.css";

export type StatusBadgeKind =
	| "progress"
	| "success"
	| "info"
	| "warning"
	| "error";

type StatusBadge = {
	id: number;
	title: string;
	secondaryText?: string;
	kind: StatusBadgeKind;
};

type StatusBadgeContextValue = {
	addStatusBadge: (badge: Omit<StatusBadge, "id">) => void;
};

const StatusBadgeContext = createContext<StatusBadgeContextValue | null>(null);

export function StatusBadgeProvider({ children }: { children: ReactNode }) {
	const [badge, setBadge] = useState<StatusBadge | null>(null);

	const addStatusBadge = useCallback((next: Omit<StatusBadge, "id">) => {
		setBadge({ ...next, id: Date.now() });
	}, []);

	useEffect(() => {
		if (!badge || badge.kind === "progress") {
			return;
		}

		const timeout = window.setTimeout(() => setBadge(null), 5_000);
		return () => window.clearTimeout(timeout);
	}, [badge]);

	return (
		<StatusBadgeContext.Provider value={{ addStatusBadge }}>
			{children}
			{badge ? (
				<div
					className={styles.overlay}
					role={badge.kind === "error" ? "alert" : "status"}
					aria-live="polite"
				>
					<div className={styles.badge} data-kind={badge.kind}>
						<Symbol name={statusSymbol(badge.kind)} className={styles.icon} />
						<div className={styles.copy}>
							<strong>{badge.title}</strong>
							{badge.secondaryText ? <span>{badge.secondaryText}</span> : null}
						</div>
						<Button
							type="button"
							variant="ghost"
							className={styles.dismiss}
							aria-label="Dismiss status"
							onClick={() => setBadge(null)}
						>
							<Symbol name="xmark" />
						</Button>
					</div>
				</div>
			) : null}
		</StatusBadgeContext.Provider>
	);
}

export function useStatusBadge() {
	const context = useContext(StatusBadgeContext);
	if (!context) {
		throw new Error("useStatusBadge must be used inside StatusBadgeProvider");
	}
	return context;
}

function statusSymbol(kind: StatusBadgeKind) {
	switch (kind) {
		case "progress":
			return "arrow.trianglehead.2.clockwise.rotate.90";
		case "success":
			return "checkmark.circle";
		case "warning":
			return "exclamationmark.triangle";
		case "error":
			return "xmark.circle";
		default:
			return "info.circle";
	}
}
