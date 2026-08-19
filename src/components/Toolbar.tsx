"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import LiquidGlass from "./LiquidGlass";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "./Toolbar.module.css";

export type ToolbarAction = {
	label: string;
	icon: string;
	onPress?: () => void;
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
	const { openSheet } = useSheet();

	const {
		title,
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		actions = [],
	} = config;

	return (
		<header className={styles.toolbar}>
			{searchPlaceholder ? (
				<LiquidGlass
					radius={300}
					scale={-80}
					border={0}
					alpha={20}
					inputBlur={12}
					outputBlur={1}
					red={10}
					green={10}
					blue={0}
					frost={0}
					saturation={1.3}
					interactive
					dragFollow={0.02}
					dragDistance={38}
					dragPressScale={1.03}
					dragDuration={1.2}
					dragReleaseDuration={0.8}
					dragStretch={0.32}
					dragSquash={0.36}
					dragBounce={2}
					filterPadding={32}
				>
					<label className={styles.search}>
						<div className={styles.something}>
							<span className="sr-only">Search {title}</span>
							<input
								value={searchValue}
								placeholder={searchPlaceholder}
								onChange={(event) => onSearchChange?.(event.target.value)}
								className={styles.searchInput}
							/>
						</div>
					</label>
				</LiquidGlass>
			) : null}

			{actions.map((action) => (
				<GlassButton
					key={`${action.icon}-${action.label}`}
					label={action.label}
					onClick={action.onPress}
				>
					<img
						className={styles.actionIcon}
						src={`/icons/${action.icon}`}
						alt="action icon"
						loading="eager"
						aria-hidden="true"
					/>
				</GlassButton>
			))}

			<GlassButton
				label="Open settings"
				onClick={() =>
					openSheet(
						<nav className={styles.toolbarSheet} aria-label="Quick settings">
							<a href="/settings">Settings</a>
							<a href="/settings/appearance">Appearance</a>
							<a href="/settings/notifications">Updates &amp; Notifications</a>
						</nav>,
					)
				}
			>
				<img
					className={styles.actionIcon}
					src={`/icons/gear.svg`}
					alt="action icon"
					loading="eager"
					aria-hidden="true"
				/>
			</GlassButton>
		</header>
	);
}
