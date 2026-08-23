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
	const [stack, setStack] = useState<ReactNode[]>([]);

	const openDrawer = useCallback((nextContent: ReactNode) => {
		setStack((current) => [...current, nextContent]);
	}, []);

	const closeDrawer = useCallback(() => {
		setStack((current) => current.slice(0, -1));
	}, []);

	const dismissFrom = useCallback((index: number) => {
		setStack((current) => current.slice(0, index));
	}, []);

	return (
		<DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
			{children}
			{stack.length ? (
				<DrawerLayer stack={stack} index={0} dismissFrom={dismissFrom} />
			) : null}
		</DrawerContext.Provider>
	);
}

function DrawerLayer({
	stack,
	index,
	dismissFrom,
}: {
	stack: ReactNode[];
	index: number;
	dismissFrom: (index: number) => void;
}) {
	const content = stack[index];

	if (!content) {
		return null;
	}

	return (
		<Drawer
			open
			onOpenChange={(open) => {
				if (!open) {
					dismissFrom(index);
				}
			}}
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className={styles.visuallyHidden}>Drawer</DrawerTitle>
				</DrawerHeader>
				<div className={styles.body}>{content}</div>
				{stack[index + 1] ? (
					<DrawerLayer
						stack={stack}
						index={index + 1}
						dismissFrom={dismissFrom}
					/>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export function useDrawer() {
	const context = useContext(DrawerContext);

	if (!context) {
		throw new Error("useDrawer must be used inside DrawerProvider");
	}

	return context;
}
