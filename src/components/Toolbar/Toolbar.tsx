import { createContext, useContext, type JSX } from "solid-js";
import { createSignal, For } from "solid-js";
import { Input } from "@/components/ui/input";
import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
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

const defaultToolbar: ToolbarConfig = { title: "Timetable" };
const ToolbarContext = createContext<{
	config: () => ToolbarConfig;
	setConfig: (config: ToolbarConfig) => void;
}>();

export function ToolbarProvider(props: { children: JSX.Element }) {
	const [config, setConfig] = createSignal(defaultToolbar);
	return (
		<ToolbarContext.Provider value={{ config, setConfig }}>
			{props.children}
		</ToolbarContext.Provider>
	);
}

export function useToolbar() {
	const context = useContext(ToolbarContext);
	if (!context) throw new Error("useToolbar must be used inside ToolbarProvider");
	return context.setConfig;
}

export default function Toolbar() {
	const context = useContext(ToolbarContext);
	if (!context) throw new Error("Toolbar must be used inside ToolbarProvider");
	const config = () => context.config();
	return (
		<header class={styles.toolbar}>
			{config().searchPlaceholder ? (
				<label class={styles.search}>
					<span>Search {config().title}</span>
					<Input
						value={config().searchValue ?? ""}
						placeholder={config().searchPlaceholder}
						onInput={(event) => config().onSearchChange?.(event.currentTarget.value)}
					/>
				</label>
			) : null}
			<For each={config().actions ?? []}>
				{(action) => (
					<Button type="button" aria-label={action.label} onClick={action.onPress}>
						<Symbol name={action.icon} />
					</Button>
				)}
			</For>
		</header>
	);
}
