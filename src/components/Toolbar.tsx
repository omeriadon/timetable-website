"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	type ReactNode,
} from "react";
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

function createDisplacementMap(width: number, height: number) {
	const canvas = document.createElement("canvas");
	const mapWidth = 128;
	const mapHeight = Math.max(64, Math.round((mapWidth * height) / width));

	canvas.width = mapWidth;
	canvas.height = mapHeight;

	const context = canvas.getContext("2d");

	if (!context) {
		return null;
	}

	const image = context.createImageData(mapWidth, mapHeight);
	const data = image.data;
	const cornerRadius = 0.22;
	const bezel = 0.2;
	const signedDistance = (x: number, y: number) => {
		const centeredX = Math.abs(x - 0.5);
		const centeredY = Math.abs(y - 0.5);
		const edgeX = centeredX - (0.5 - cornerRadius);
		const edgeY = centeredY - (0.5 - cornerRadius);
		const outsideDistance = Math.hypot(Math.max(edgeX, 0), Math.max(edgeY, 0));
		const insideDistance = Math.min(Math.max(edgeX, edgeY), 0);

		return outsideDistance + insideDistance - cornerRadius;
	};

	for (let y = 0; y < mapHeight; y += 1) {
		for (let x = 0; x < mapWidth; x += 1) {
			const normalizedX = x / (mapWidth - 1);
			const normalizedY = y / (mapHeight - 1);

			const distanceFromEdge = Math.max(
				0,
				-signedDistance(normalizedX, normalizedY),
			);
			const edgeFactor = Math.max(0, 1 - distanceFromEdge / bezel);
			const falloff = edgeFactor * edgeFactor * (3 - 2 * edgeFactor);
			const delta = 1 / mapWidth;
			const normalX =
				(signedDistance(normalizedX + delta, normalizedY) -
					signedDistance(normalizedX - delta, normalizedY)) /
				(2 * delta);
			const normalY =
				(signedDistance(normalizedX, normalizedY + delta) -
					signedDistance(normalizedX, normalizedY - delta)) /
				(2 * delta);
			const normalLength = Math.hypot(normalX, normalY) || 1;
			const verticalDisplacement = (-normalX / normalLength) * falloff * 0.8;
			const horizontalDisplacement = (-normalY / normalLength) * falloff * 0.8;
			const pixelIndex = (y * mapWidth + x) * 4;

			data[pixelIndex] = 128 + verticalDisplacement * 127;
			data[pixelIndex + 1] = 128 + horizontalDisplacement * 127;
			data[pixelIndex + 2] = 128;
			data[pixelIndex + 3] = 255;
		}
	}

	context.putImageData(image, 0, 0);

	return canvas.toDataURL("image/png");
}

export function LiquidGlassButton({
	action,
	className,
	children,
}: {
	action: ToolbarAction;
	className?: string;
	children?: ReactNode;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const filterId = `toolbar-liquid-glass-${useId().replace(/:/g, "")}`;
	const [displacementMap, setDisplacementMap] = useState<string | null>(null);
	const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const button = buttonRef.current;

		if (!button) {
			return;
		}

		const updateMap = () => {
			const { width, height } = button.getBoundingClientRect();

			if (width > 0 && height > 0) {
				setButtonSize({ width, height });
				setDisplacementMap(createDisplacementMap(width, height));
			}
		};

		updateMap();
		const resizeObserver = new ResizeObserver(updateMap);
		resizeObserver.observe(button);

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<>
			<svg
				className={styles.liquidGlassFilter}
				aria-hidden="true"
				width={buttonSize.width}
				height={buttonSize.height}
				focusable="false"
			>
				<defs>
					<filter
						id={filterId}
						filterUnits="userSpaceOnUse"
						x={-buttonSize.width * 0.2}
						y={-buttonSize.height * 0.2}
						width={buttonSize.width * 1.4}
						height={buttonSize.height * 1.4}
						colorInterpolationFilters="sRGB"
					>
						{displacementMap ? (
							<>
								<feImage
									href={displacementMap}
									x="0"
									y="0"
									width={buttonSize.width}
									height={buttonSize.height}
									preserveAspectRatio="none"
									result="displacement-map"
								/>
								<feDisplacementMap
									in="SourceGraphic"
									in2="displacement-map"
									scale="52"
									xChannelSelector="R"
									yChannelSelector="G"
									result="refracted"
								/>
							</>
						) : null}
					</filter>
				</defs>
			</svg>

			<button
				ref={buttonRef}
				type="button"
				className={`${styles.addButton} ${className ?? ""}`}
				onClick={action.onPress}
				aria-label={action.label}
				style={{
					backdropFilter: displacementMap ? `url("#${filterId}")` : "none",
					WebkitBackdropFilter: displacementMap
						? `url("#${filterId}")`
						: "none",
				}}
			>
				{children ?? (
					<img
						className={styles.actionIcon}
						src={`/icons/${action.icon}`}
						alt=""
						aria-hidden="true"
					/>
				)}
			</button>
		</>
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
				<LiquidGlassButton
					key={`${action.icon}-${action.label}`}
					action={action}
				/>
			))}
		</header>
	);
}
