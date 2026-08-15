"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import {
	CalendarPlus,
	Download,
	FolderPlus,
	Plus,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import styles from "./Toolbar.module.css";

export type ToolbarSymbol =
	| "calendarPlus"
	| "download"
	| "folderPlus"
	| "plus"
	| "sliders";

export type ToolbarAction = {
	label: string;
	symbol: ToolbarSymbol;
	onPress: () => void;
};

export type ToolbarConfig = {
	title: string;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	actions?: ToolbarAction[];
};

const symbols = {
	calendarPlus: CalendarPlus,
	download: Download,
	folderPlus: FolderPlus,
	plus: Plus,
	sliders: SlidersHorizontal,
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
						<Search size={16} aria-hidden="true" />
						<span className="sr-only">Search {title}</span>
						<input
							value={searchValue}
							placeholder={searchPlaceholder}
							onChange={(event) => onSearchChange?.(event.target.value)}
						/>
					</label>
				) : null}
				{actions.map((action) => {
					const Icon = symbols[action.symbol];

					return (
					<button
						key={`${action.symbol}-${action.label}`}
						type="button"
						className={styles.addButton}
						onClick={action.onPress}
						aria-label={action.label}
					>
						<Icon size={16} aria-hidden="true" />
						<span>{action.label}</span>
					</button>
					);
				})}
			</div>
		</header>
	);
}
