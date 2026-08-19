"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { Button } from "@base-ui/react/button";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

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
						<DrawerTitle>Timetable drawer</DrawerTitle>
					</DrawerHeader>
					<div>{content}</div>
					<DrawerFooter>
						<DrawerClose render={<Button type="button" />}>
							<Symbol name="xmark" />
							Close
						</DrawerClose>
					</DrawerFooter>
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
