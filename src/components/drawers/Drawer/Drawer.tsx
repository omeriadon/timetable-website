import { createContext, createSignal, useContext, type JSX } from "solid-js";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import styles from "@/components/ui/drawer.module.css";

type DrawerControls = {
	openDrawer: (content: () => JSX.Element) => void;
	closeDrawer: () => void;
};

type DrawerEntry = {
	id: number;
	content: () => JSX.Element;
	open: boolean;
};

const DrawerContext = createContext<DrawerControls | null>(null);

export function DrawerProvider(props: { children: JSX.Element }) {
	const [stack, setStack] = createSignal<DrawerEntry[]>([]);
	let nextDrawerID = 0;

	const openDrawer = (nextContent: () => JSX.Element) => {
		nextDrawerID += 1;
		setStack((current) => [
			...current,
			{
				id: nextDrawerID,
				content: nextContent,
				open: true,
			},
		]);
	};

	const closeDrawer = () => {
		setStack((current) =>
			current.map((entry, index) =>
				index === current.length - 1 ? { ...entry, open: false } : entry,
			),
		);
	};

	const dismissFrom = (index: number) => {
		setStack((current) =>
			current.map((entry, entryIndex) =>
				entryIndex >= index ? { ...entry, open: false } : entry,
			),
		);
	};

	const removeClosedLayer = (id: number) => {
		setStack((current) => {
			const index = current.findIndex((entry) => entry.id === id);
			if (index < 0 || current[index]?.open) {
				return current;
			}
			return current.slice(0, index);
		});
	};

	return (
		<DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
			{props.children}
			{stack().length ? (
				<DrawerLayer
					stack={stack()}
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
		>
			<DrawerContent>
				<DrawerHeader>
						<DrawerTitle class={styles.visuallyHidden}>Drawer</DrawerTitle>
				</DrawerHeader>
				<div class={styles.body}>{entry.content()}</div>
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
