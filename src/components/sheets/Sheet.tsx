"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import GlassButton from "@/components/controls/GlassButton";
import styles from "./Sheet.module.css";

type SheetControls = {
  openSheet: (content: ReactNode) => void;
  closeSheet: () => void;
};

const SheetContext = createContext<SheetControls | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode>(null);

	const closeSheet = () => setContent(null);

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

  return (
    <SheetContext.Provider value={{ openSheet: setContent, closeSheet }}>
      {children}
      {content ? (
        <div className={styles.sheetRoot} role="presentation">
          <button
            type="button"
            className={styles.scrim}
            aria-label="Close sheet"
            onClick={closeSheet}
          />
          <section className={styles.sheet} role="dialog" aria-modal="true">
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
