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
import styles from "./Toolbar.module.css";

export type ToolbarAction = {
	label: string;
	icon: string;
	onPress: () => void;
};

export type ToolbarConfig = {
	title: string;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	actions?: ToolbarAction[];
};

const defaultToolbar: ToolbarConfig = {
	title: "Timetable",
};

const ToolbarContext = createContext<{
	config: ToolbarConfig;
	setConfig: (config: ToolbarConfig) => void;
}>({
	config: defaultToolbar,
	setConfig: () => undefined,
});

export function ToolbarProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState(defaultToolbar);

	return (
		<ToolbarContext.Provider value={{ config, setConfig }}>
			{children}
		</ToolbarContext.Provider>
	);
}

export function useToolbar() {
	const { setConfig } = useContext(ToolbarContext);

	return useCallback((config: ToolbarConfig) => setConfig(config), [setConfig]);
}

export default function Toolbar() {
	const { config } = useContext(ToolbarContext);
	const toolbarRef = useRef<HTMLElement>(null);

	const {
		title,
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		actions = [],
	} = config;
	const actionKey = actions
		.map((action) => `${action.icon}-${action.label}`)
		.join("|");

	useEffect(() => {
		const root = toolbarRef.current;

		if (!root || !actionKey) {
			return;
		}

		const glassElements = Array.from(root.children).filter(
			(child): child is HTMLElement => child.hasAttribute("data-liquid-gl"),
		);

		if (glassElements.length === 0) {
			return;
		}

		let cancelled = false;
		let instance: { destroy: () => void } | undefined;

		void import("@ybouane/liquidglass")
			.then(({ LiquidGlass }) =>
				LiquidGlass.init({
					root,
					glassElements,
				}),
			)
			.then((newInstance) => {
				if (cancelled) {
					newInstance.destroy();
					return;
				}

				instance = newInstance;
			})
			.catch(() => undefined);

		return () => {
			cancelled = true;
			instance?.destroy();
		};
	}, [actionKey]);

	return (
		<header ref={toolbarRef} className={styles.toolbar}>
			<div className={styles.heading}>
				<h1>{title}</h1>
			</div>

			{searchPlaceholder ? (
				<label className={styles.search}>
					<span className="sr-only">Search {title}</span>
					<input
						value={searchValue}
						placeholder={searchPlaceholder}
						onChange={(event) => onSearchChange?.(event.target.value)}
					/>
				</label>
			) : null}

			{actions.map((action) => (
				<button
					key={`${action.icon}-${action.label}`}
					type="button"
					className={styles.addButton}
					data-liquid-gl
					data-config={JSON.stringify({
						button: true,
						cornerRadius: 12,
						zRadius: 12,
					})}
					onClick={action.onPress}
					aria-label={action.label}
				>
					<img
						className={styles.actionIcon}
						src={`/icons/${action.icon}`}
						alt=""
						aria-hidden="true"
					/>
					<span>{action.label}</span>
				</button>
			))}
		</header>
	);
}
