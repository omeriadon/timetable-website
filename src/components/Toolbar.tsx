"use client";

import {
	createContext,
	useCallback,
	useContext,
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
	const {
		title,
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		actions = [],
	} = config;

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
				{actions.map((action) => {
					return (
					<button
						key={`${action.icon}-${action.label}`}
							type="button"
							className={styles.addButton}
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
					);
				})}
			</div>
		</header>
	);
}
