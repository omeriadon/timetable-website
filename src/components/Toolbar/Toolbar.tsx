"use client";

import { Input } from "@/components/ui/Input";
import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import { toolbarGlassProps } from "@/components/LiquidGlass/presets";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import QuickSettingsSheet from "@/components/sheets/QuickSettingsSheet/QuickSettingsSheet";
import styles from "./Toolbar.module.css";

export type ToolbarAction = {
	label: string;
	icon: string;
	onPress?: () => void;
};

export type ToolbarConfig = {
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	actions?: ToolbarAction[];
};

const defaultToolbar: ToolbarConfig = {};

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
		searchPlaceholder,
		searchValue = "",
		onSearchChange,
		actions = [],
	} = config;

	return (
		<header className={styles.toolbar}>
			{searchPlaceholder ? (
				<LiquidGlass {...toolbarGlassProps}>
					<label className={styles.search}>
						<div className={styles.something}>
							<Input
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
					<SymbolIcon name={action.icon} className={styles.actionIcon} />
				</GlassButton>
			))}

			<GlassButton
				label="Open settings"
				onClick={() => openSheet(<QuickSettingsSheet />)}
			>
				<SymbolIcon name="gear" className={styles.actionIcon} />
			</GlassButton>
		</header>
	);
}
