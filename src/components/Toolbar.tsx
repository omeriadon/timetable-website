"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import styles from "./Toolbar.module.css";

declare global {
	interface Window {
		__timetableLiquidGLInitialized?: boolean;
	}
}

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

	const {
		title,
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		actions = [],
	} = config;

	useEffect(() => {
		if (window.__timetableLiquidGLInitialized) {
			return;
		}

		window.__timetableLiquidGLInitialized = true;

		void import("liquid-gl").then(({ default: liquidGL }) => {
			liquidGL({
				target: "[data-liquid-gl]",
				snapshot: "body",
				resolution: 1,
				refraction: 0.01,
				aberration: 0,
				bevelDepth: 0.08,
				bevelWidth: 0.15,
				frost: 0,
				shadow: true,
				specular: true,
				reveal: "fade",
				tilt: false,
				magnify: 1,
			});
		});
	}, []);

	return (
		<header className={styles.toolbar}>
			<div className={styles.heading}>
				<h1>{title}</h1>
			</div>

			<div className={styles.actions}>
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
			</div>
		</header>
	);
}
