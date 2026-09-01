import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
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
				<label className={styles.search}>
					<span>Search {title}</span>
					<Input
						value={searchValue}
						placeholder={searchPlaceholder}
						onChange={(event) => onSearchChange?.(event.target.value)}
					/>
				</label>
			) : null}

			{actions.map((action) => (
				<Button
					type="button"
					key={`${action.icon}-${action.label}`}
					aria-label={action.label}
					onClick={action.onPress}
				>
					<Symbol name={action.icon} />
				</Button>
			))}
		</header>
	);
}
