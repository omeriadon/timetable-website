"use client";

import { domToCanvas, waitUntilLoad } from "modern-screenshot";
import { usePathname } from "next/navigation";
import {
	type CSSProperties,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import styles from "./Sidebar.module.css";

const captureScale = 0.15;
const reflectionWidth = 18;
const sourceSampleWidth = 360;

type ReflectionTexture = {
	dataUrl: string;
	height: number;
	offset: number;
	travel: number;
};

type ReflectionStyle = CSSProperties & {
	"--reflection-height": string;
	"--reflection-image": string;
	"--reflection-offset": string;
	"--reflection-travel": string;
};

function textureStyle(texture: ReflectionTexture): ReflectionStyle {
	return {
		"--reflection-height": `${texture.height}px`,
		"--reflection-image": `url("${texture.dataUrl}")`,
		"--reflection-offset": `${texture.offset}px`,
		"--reflection-travel": `${texture.travel}px`,
	};
}

export default function SidebarReflection() {
	const pathname = usePathname();
	const viewportRef = useRef<HTMLDivElement>(null);
	const captureVersionRef = useRef(0);
	const [texture, setTexture] = useState<ReflectionTexture | null>(null);

	const capture = useCallback(async () => {
		const viewport = viewportRef.current;
		const sidebar = viewport?.closest("aside");
		const source = document.querySelector<HTMLElement>(
			"[data-sidebar-reflection-source]",
		);

		if (!viewport || !sidebar || !source || window.innerWidth <= 700) {
			setTexture(null);
			return;
		}

		const captureVersion = ++captureVersionRef.current;
		const sourceHeight = source.scrollHeight;
		const sourceWidth = source.scrollWidth;

		if (sourceHeight === 0 || sourceWidth === 0) {
			return;
		}

		try {
			await waitUntilLoad(source, { timeout: 2_000 });

			const sourceCanvas = await domToCanvas(source, {
				width: sourceWidth,
				height: sourceHeight,
				scale: captureScale,
				backgroundColor: "#000000",
				font: false,
				style: {
					height: `${sourceHeight}px`,
					overflow: "visible",
					width: `${sourceWidth}px`,
				},
				features: {
					copyScrollbar: false,
					fixSvgXmlDecode: true,
					removeAbnormalAttributes: true,
					removeControlCharacter: true,
					restoreScrollPosition: false,
				},
				timeout: 5_000,
			});

			if (captureVersion !== captureVersionRef.current) {
				return;
			}

			const textureCanvas = document.createElement("canvas");
			const textureHeight = Math.max(
				1,
				Math.round(sourceHeight * captureScale),
			);
			textureCanvas.width = reflectionWidth;
			textureCanvas.height = textureHeight;

			const context = textureCanvas.getContext("2d");

			if (!context) {
				return;
			}

			const capturedSampleWidth = Math.min(
				sourceCanvas.width,
				Math.round(sourceSampleWidth * captureScale),
			);
			context.imageSmoothingEnabled = true;
			context.imageSmoothingQuality = "high";
			context.drawImage(
				sourceCanvas,
				0,
				0,
				capturedSampleWidth,
				sourceCanvas.height,
				0,
				0,
				reflectionWidth,
				textureHeight,
			);

			const sourceBounds = source.getBoundingClientRect();
			const sidebarBounds = sidebar.getBoundingClientRect();

			setTexture({
				dataUrl: textureCanvas.toDataURL("image/png"),
				height: sourceHeight,
				offset: sourceBounds.top - sidebarBounds.top,
				travel: Math.max(0, sourceHeight - source.clientHeight),
			});
		} catch {
			if (captureVersion === captureVersionRef.current) {
				setTexture(null);
			}
		}
	}, []);

	useEffect(() => {
		let debounceTimer: number | null = null;
		let idleCallback: number | null = null;
		const source = document.querySelector<HTMLElement>(
			"[data-sidebar-reflection-source]",
		);

		if (!source) {
			return;
		}

		const scheduleCapture = () => {
			if (debounceTimer !== null) {
				window.clearTimeout(debounceTimer);
			}

			debounceTimer = window.setTimeout(() => {
				if ("requestIdleCallback" in window) {
					idleCallback = window.requestIdleCallback(() => {
						void capture();
					}, { timeout: 500 });
					return;
				}

				void capture();
			}, 180);
		};

		const resizeObserver = new ResizeObserver(scheduleCapture);
		resizeObserver.observe(source);

		for (const child of source.children) {
			resizeObserver.observe(child);
		}

		const mutationObserver = new MutationObserver(scheduleCapture);
		mutationObserver.observe(source, {
			childList: true,
			subtree: true,
		});

		window.addEventListener("resize", scheduleCapture);
		scheduleCapture();

		return () => {
			captureVersionRef.current += 1;
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.removeEventListener("resize", scheduleCapture);

			if (debounceTimer !== null) {
				window.clearTimeout(debounceTimer);
			}

			if (idleCallback !== null && "cancelIdleCallback" in window) {
				window.cancelIdleCallback(idleCallback);
			}
		};
	}, [capture, pathname]);

	const style = texture ? textureStyle(texture) : undefined;

	return (
		<div
			ref={viewportRef}
			className={styles.reflectionViewport}
			aria-hidden="true"
		>
			{texture ? (
				<>
					<div className={styles.reflectionTexture} style={style} />
					<div className={styles.reflectionOutline}>
						<div
							className={styles.reflectionOutlineTexture}
							style={style}
						/>
					</div>
				</>
			) : null}
		</div>
	);
}
