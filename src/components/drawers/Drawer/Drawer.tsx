import {
	createContext,
	useCallback,
	useContext,
	useRef,
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

type DrawerEntry = {
	id: number;
	content: ReactNode;
	open: boolean;
};

const DrawerContext = createContext<DrawerControls | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
	const [stack, setStack] = useState<DrawerEntry[]>([]);
	const nextDrawerID = useRef(0);

	const openDrawer = useCallback((nextContent: ReactNode) => {
		nextDrawerID.current += 1;
		setStack((current) => [
			...current,
			{
				id: nextDrawerID.current,
				content: nextContent,
				open: true,
			},
		]);
	}, []);

	const closeDrawer = useCallback(() => {
		setStack((current) =>
			current.map((entry, index) =>
				index === current.length - 1 ? { ...entry, open: false } : entry,
			),
		);
	}, []);

	const dismissFrom = useCallback((index: number) => {
		setStack((current) =>
			current.map((entry, entryIndex) =>
				entryIndex >= index ? { ...entry, open: false } : entry,
			),
		);
	}, []);

	const removeClosedLayer = useCallback((id: number) => {
		setStack((current) => {
			const index = current.findIndex((entry) => entry.id === id);
			if (index < 0 || current[index]?.open) {
				return current;
			}
			return current.slice(0, index);
		});
	}, []);

	return (
		<DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
			{children}
			{stack.length ? (
				<DrawerLayer
					stack={stack}
					index={0}
					dismissFrom={dismissFrom}
					removeClosedLayer={removeClosedLayer}
				/>
			) : null}
		</DrawerContext.Provider>
	);
}

function DrawerLayer({
	stack,
	index,
	dismissFrom,
	removeClosedLayer,
}: {
	stack: DrawerEntry[];
	index: number;
	dismissFrom: (index: number) => void;
	removeClosedLayer: (id: number) => void;
}) {
	const entry = stack[index];

	if (!entry) {
		return null;
	}

	return (
		<Drawer
			key={entry.id}
			open={entry.open}
			onOpenChange={(open) => {
				if (!open) {
					dismissFrom(index);
				}
			}}
			onOpenChangeComplete={(open) => {
				if (!open) {
					removeClosedLayer(entry.id);
				}
			}}
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className={styles.visuallyHidden}>Drawer</DrawerTitle>
				</DrawerHeader>
				<div className={styles.body}>{entry.content}</div>
				{stack[index + 1] ? (
					<DrawerLayer
						stack={stack}
						index={index + 1}
						dismissFrom={dismissFrom}
						removeClosedLayer={removeClosedLayer}
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
