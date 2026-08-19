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
			<Drawer.Root
				open={isOpen}
				onOpenChange={setIsOpen}
				onOpenChangeComplete={(open) => {
					if (!open) {
						setContent(null);
					}
				}}
				snapPoints={[0.5, 0.7, 0.92]}
				defaultSnapPoint={0.7}
				swipeDirection="down"
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
								render={
									<LiquidGlass
										radius={999}
										scale={-80}
										border={0}
										alpha={20}
										inputBlur={12}
										outputBlur={1}
										red={10}
										green={10}
										blue={0}
										frost={0}
										saturation={1.3}
										interactive
										dragFollow={0.05}
										dragDistance={38}
										dragPressScale={1.06}
										dragDuration={0.35}
										dragReleaseDuration={0.45}
										dragStretch={0.18}
										dragSquash={0.12}
										dragBounce={0.25}
										filterPadding={32}
									/>
								}
								className={`${primitiveStyles.drawerClose} ${primitiveStyles.glassButton}`}
								aria-label="Close sheet"
							>
								<span aria-hidden="true">×</span>
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
