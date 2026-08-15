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
import LiquidGlass from "liquid-glass-react";
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

function ToolbarActionButton({ action }: { action: ToolbarAction }) {
	const actionButtonRef = useRef<HTMLDivElement>(null);
	const [isGlassReady, setIsGlassReady] = useState(false);
	const [globalMousePos, setGlobalMousePos] = useState({ x: 0, y: 0 });
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

	useEffect(() => {
		setIsGlassReady(true);
	}, []);

	const updateGlassPosition = (event: React.MouseEvent<HTMLDivElement>) => {
		const bounds = actionButtonRef.current?.getBoundingClientRect();

		if (!bounds) {
			return;
		}

		setGlobalMousePos({ x: event.clientX, y: event.clientY });
		setMouseOffset({
			x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 100,
			y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 100,
		});
	};

	return (
		<div
			ref={actionButtonRef}
			className={`${styles.addButton} ${
				isGlassReady ? styles.liquidGlassReady : ""
			}`}
			onMouseMove={updateGlassPosition}
		>
			{isGlassReady ? (
				<LiquidGlass
					className={styles.liquidGlass}
					displacementScale={28}
					blurAmount={0.1}
					saturation={120}
					aberrationIntensity={1}
					elasticity={0.1}
					cornerRadius={12}
					padding="9px 13px"
					globalMousePos={globalMousePos}
					mouseOffset={mouseOffset}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						pointerEvents: "none",
					}}
				>
					<span className={styles.liquidGlassContent} aria-hidden="true">
						<img
							className={styles.actionIcon}
							src={`/icons/${action.icon}`}
							alt=""
						/>
						<span>{action.label}</span>
					</span>
				</LiquidGlass>
			) : null}

			<button
				type="button"
				className={styles.actionControl}
				onClick={action.onPress}
				aria-label={action.label}
			>
				<img src={`/icons/${action.icon}`} alt="" aria-hidden="true" />
				<span>{action.label}</span>
			</button>
		</div>
	);
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
				<ToolbarActionButton
					key={`${action.icon}-${action.label}`}
					action={action}
				/>
			))}
		</header>
	);
}
