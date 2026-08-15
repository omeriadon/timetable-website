"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { Plus, Search } from "lucide-react";
import styles from "./Toolbar.module.css";

export type ToolbarConfig = {
	title: string;
	subtitle?: string;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onAdd?: () => void;
	children?: ReactNode;
};

const defaultToolbar: ToolbarConfig = {
	title: "Timetable",
	subtitle: "Your workspace at a glance.",
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

	return useCallback(
		(config: ToolbarConfig) => setConfig(config),
		[setConfig],
	);
}

export default function Toolbar() {
	const { config } = useContext(ToolbarContext);
	const {
		title,
		subtitle,
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		onAdd,
		children,
	} = config;

	return (
		<header className={styles.toolbar}>
			<div className={styles.heading}>
				<p className={styles.eyebrow}>Workspace</p>
				<h1>{title}</h1>
				{subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
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
				{children}
				{onAdd ? (
					<button
						type="button"
						className={styles.addButton}
						onClick={onAdd}
						aria-label={`Add item to ${title}`}
					>
						<Plus size={16} aria-hidden="true" />
						<span>Add item</span>
					</button>
				) : null}
			</div>
		</header>
	);
}
