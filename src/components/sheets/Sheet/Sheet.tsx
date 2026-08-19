"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { Drawer } from "@base-ui/react/drawer";
import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import { glassButtonProps } from "@/components/LiquidGlass/presets";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
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
	const isCompact = useCompactLayout();

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
			<Drawer.Root
				open={isOpen}
				onOpenChange={setIsOpen}
				onOpenChangeComplete={(open) => {
					if (!open) {
						setContent(null);
					}
				}}
				snapPoints={isCompact ? [0.5, 0.7, 0.92] : undefined}
				defaultSnapPoint={isCompact ? 0.7 : undefined}
				swipeDirection={isCompact ? "down" : "right"}
			>
				<Drawer.Portal>
					<Drawer.Backdrop className={primitiveStyles.drawerBackdrop} />
					<Drawer.Viewport className={primitiveStyles.drawerViewport}>
						<Drawer.Popup className={primitiveStyles.drawerPopup}>
							<Drawer.Title className={primitiveStyles.drawerTitle}>
								Timetable sheet
							</Drawer.Title>
							<Drawer.Close
								nativeButton={false}
								render={<LiquidGlass {...glassButtonProps} />}
								className={`${primitiveStyles.drawerClose} ${primitiveStyles.glassButton}`}
								aria-label="Close sheet"
							>
								<Symbol
									name="xmark"
									className={primitiveStyles.drawerCloseIcon}
								/>
							</Drawer.Close>
							<Drawer.Content className={styles.sheetContent}>
								{content}
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
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
