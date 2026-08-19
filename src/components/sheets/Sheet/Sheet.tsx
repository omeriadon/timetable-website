"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { Dialog } from "@base-ui/react/dialog";
import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import { glassButtonProps } from "@/components/LiquidGlass/presets";
import Symbol from "@/components/controls/Symbol/Symbol";
import primitiveStyles from "@/components/ui/primitives.module.css";
import styles from "./Sheet.module.css";

type SheetControls = {
	openSheet: (content: ReactNode) => void;
	closeSheet: () => void;
};

const SheetContext = createContext<SheetControls | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openSheet = useCallback((nextContent: ReactNode) => {
		setContent(nextContent);
		setIsOpen(true);
	}, []);

	const closeSheet = useCallback(() => {
		if (!content) {
			return;
		}
		setIsOpen(false);
	}, [content]);

	return (
		<SheetContext.Provider value={{ openSheet, closeSheet }}>
			{children}
			<Dialog.Root
				open={isOpen}
				onOpenChange={setIsOpen}
				onOpenChangeComplete={(open) => {
					if (!open) {
						setContent(null);
					}
				}}
			>
				<Dialog.Portal>
					<Dialog.Backdrop className={primitiveStyles.sheetBackdrop} />
					<Dialog.Popup className={primitiveStyles.sheetPopup}>
						<Dialog.Title className={primitiveStyles.drawerTitle}>
							Timetable sheet
						</Dialog.Title>
						<Dialog.Close
							nativeButton={false}
							render={<LiquidGlass {...glassButtonProps} />}
							className={primitiveStyles.sheetClose}
							aria-label="Close sheet"
						>
							<Symbol name="xmark" className={primitiveStyles.sheetCloseIcon} />
						</Dialog.Close>
						<div className={styles.sheetContent}>{content}</div>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
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
