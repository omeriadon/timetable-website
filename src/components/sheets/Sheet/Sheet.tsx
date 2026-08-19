"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import styles from "./Sheet.module.css";

type SheetControls = {
	openSheet: (content: ReactNode) => void;
	closeSheet: () => void;
};

const SheetContext = createContext<SheetControls | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode>(null);
	const [isClosing, setIsClosing] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const openSheet = useCallback((nextContent: ReactNode) => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
		setIsClosing(false);
		setContent(nextContent);
	}, []);

	const closeSheet = useCallback(() => {
		if (!content || isClosing) {
			return;
		}
		setIsClosing(true);
		closeTimer.current = setTimeout(() => {
			setContent(null);
			setIsClosing(false);
			closeTimer.current = null;
		}, 240);
	}, [content, isClosing]);

	useEffect(() => {
		if (!content) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeSheet();
			}
		};
		document.addEventListener("keydown", closeOnEscape);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, [content]);

	useEffect(() => {
		return () => {
			if (closeTimer.current) {
				clearTimeout(closeTimer.current);
			}
		};
	}, []);

	return (
		<SheetContext.Provider value={{ openSheet, closeSheet }}>
			{children}
			{content ? (
				<div
					className={
						isClosing
							? `${styles.sheetRoot} ${styles.closing}`
							: styles.sheetRoot
					}
					role="presentation"
				>
					<button
						type="button"
						className={styles.scrim}
						aria-label="Close sheet"
						onClick={closeSheet}
					/>
					<section
						className={styles.sheet}
						role="dialog"
						aria-modal="true"
						onClick={(event) => event.stopPropagation()}
					>
						<GlassButton
							label="Close sheet"
							onClick={closeSheet}
							className={styles.closeButton}
							size="compact"
						>
							<span aria-hidden="true">×</span>
						</GlassButton>
						<div className={styles.sheetContent}>{content}</div>
					</section>
				</div>
			) : null}
		</SheetContext.Provider>
	);
}

export function useSheet() {
	const context = useContext(SheetContext);

	if (!context) {
		throw new Error("useSheet must be used inside SheetProvider");
	}

	return context;
}
