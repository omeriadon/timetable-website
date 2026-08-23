"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import styles from "@/components/ui/drawer.module.css";

type DrawerControls = {
	openDrawer: (content: ReactNode) => void;
	closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerControls | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openDrawer = useCallback((nextContent: ReactNode) => {
		setContent(nextContent);
		setIsOpen(true);
	}, []);

	const closeDrawer = useCallback(() => {
		if (!content) {
			return;
		}
		setIsOpen(false);
	}, [content]);

	return (
		<DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
			{children}
			<Drawer
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open);
					if (!open) {
						setContent(null);
					}
				}}
			>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle className={styles.visuallyHidden}>Drawer</DrawerTitle>
					</DrawerHeader>
					<div>{content}</div>
				</DrawerContent>
			</Drawer>
		</DrawerContext.Provider>
	);
}

export function useDrawer() {
	const context = useContext(DrawerContext);

	if (!context) {
		throw new Error("useDrawer must be used inside DrawerProvider");
	}

	return context;
}
