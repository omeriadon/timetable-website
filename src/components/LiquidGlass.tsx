"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useRef,
} from "react";
import gsap from "gsap";
import styles from "./LiquidGlass.module.css";

type LiquidGlassProps = {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	onClick?: () => void;

	radius?: number;
	border?: number;
	lightness?: number;
	alpha?: number;
	inputBlur?: number;
	outputBlur?: number;

	scale?: number;

	red?: number;
	green?: number;
	blue?: number;

	saturation?: number;
	frost?: number;

	xChannel?: "R" | "G" | "B";
	yChannel?: "R" | "G" | "B";

	blend?: string;
};

export default function LiquidGlass({
	children,
	className,
	style,
	onClick,

	radius = 16,
	border = 0.07,
	lightness = 50,
	alpha = 0.93,
	inputBlur = 11,
	outputBlur = 0.2,

	scale = -180,

	red = 0,
	green = 10,
	blue = 20,

	saturation = 1.5,
	frost = 0.05,

	xChannel = "R",
	yChannel = "B",

	blend = "difference",
}: LiquidGlassProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<HTMLDivElement>(null);

	const feImageRef = useRef<SVGFEImageElement>(null);

	const redRef = useRef<SVGFEDisplacementMapElement>(null);
	const greenRef = useRef<SVGFEDisplacementMapElement>(null);
	const blueRef = useRef<SVGFEDisplacementMapElement>(null);

	const blurRef = useRef<SVGFEGaussianBlurElement>(null);

	const id = useId().replace(/:/g, "");
	const filterId = `liquid-glass-${id}`;

	useEffect(() => {
		const root = rootRef.current;
		const mapContainer = mapRef.current;

		if (!root || !mapContainer) return;

		const update = () => {
			const rect = root.getBoundingClientRect();

			const width = Math.max(1, Math.round(rect.width));
			const height = Math.max(1, Math.round(rect.height));

			const displacementBorder = Math.min(width, height) * (border * 0.5);

			/*
			 * This is intentionally almost identical to the CodePen.
			 *
			 * Do not replace this with an SVG React element.
			 * The original serializes the SVG and feeds it into
			 * <feImage> as a data URI.
			 */
			const displacementSVG = `
				<svg
					class="displacement-image"
					viewBox="0 0 ${width} ${height}"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient
							id="red"
							x1="100%"
							y1="0%"
							x2="0%"
							y2="0%"
						>
							<stop
								offset="0%"
								stop-color="#000"
							/>
							<stop
								offset="100%"
								stop-color="red"
							/>
						</linearGradient>

						<linearGradient
							id="blue"
							x1="0%"
							y1="0%"
							x2="0%"
							y2="100%"
						>
							<stop
								offset="0%"
								stop-color="#000"
							/>
							<stop
								offset="100%"
								stop-color="blue"
							/>
						</linearGradient>
					</defs>

					<!-- backdrop -->
					<rect
						x="0"
						y="0"
						width="${width}"
						height="${height}"
						fill="black"
					/>

					<!-- red linear -->
					<rect
						x="0"
						y="0"
						width="${width}"
						height="${height}"
						rx="${radius}"
						fill="url(#red)"
					/>

					<!-- blue linear -->
					<rect
						x="0"
						y="0"
						width="${width}"
						height="${height}"
						rx="${radius}"
						fill="url(#blue)"
						style="mix-blend-mode:${blend}"
					/>

					<!-- block out distortion -->
					<rect
						x="${displacementBorder}"
						y="${displacementBorder}"
						width="${width - displacementBorder * 2}"
						height="${height - displacementBorder * 2}"
						rx="${radius}"
						fill="hsl(0 0% ${lightness}% / ${alpha})"
						style="filter:blur(${inputBlur}px)"
					/>
				</svg>
			`;

			mapContainer.innerHTML = displacementSVG;

			const svg = mapContainer.querySelector(
				".displacement-image",
			) as SVGSVGElement | null;

			if (!svg) return;

			const serialized = new XMLSerializer().serializeToString(svg);

			const encoded = encodeURIComponent(serialized);

			const dataUri = `data:image/svg+xml,${encoded}`;

			if (feImageRef.current) {
				gsap.set(feImageRef.current, {
					attr: {
						href: dataUri,
					},
				});
			}

			const displacementMaps = [
				redRef.current,
				greenRef.current,
				blueRef.current,
			].filter(Boolean);

			for (const map of displacementMaps) {
				gsap.set(map, {
					attr: {
						xChannelSelector: xChannel,
						yChannelSelector: yChannel,
					},
				});
			}

			if (redRef.current) {
				gsap.set(redRef.current, {
					attr: {
						scale: scale + red,
					},
				});
			}

			if (greenRef.current) {
				gsap.set(greenRef.current, {
					attr: {
						scale: scale + green,
					},
				});
			}

			if (blueRef.current) {
				gsap.set(blueRef.current, {
					attr: {
						scale: scale + blue,
					},
				});
			}

			if (blurRef.current) {
				gsap.set(blurRef.current, {
					attr: {
						stdDeviation: outputBlur,
					},
				});
			}
		};

		update();

		const observer = new ResizeObserver(() => {
			update();
		});

		observer.observe(root);

		return () => {
			observer.disconnect();
		};
	}, [
		radius,
		border,
		lightness,
		alpha,
		inputBlur,
		outputBlur,
		scale,
		red,
		green,
		blue,
		xChannel,
		yChannel,
		blend,
	]);

	return (
		<div
			ref={rootRef}
			className={`${styles.effect} ${className ?? ""}`}
			onClick={onClick}
			style={
				{
					"--liquid-radius": `${radius}px`,
					"--liquid-frost": frost,
					"--liquid-saturation": saturation,
					...style,
				} as CSSProperties
			}
		>
			<div className={styles.content}>{children}</div>

			{/*
				IMPORTANT:
				The original SVG occupies the full glass element.
				Do NOT change this to width={0} height={0}.
			*/}
			<svg
				className={styles.filter}
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<defs>
					<filter id={filterId} colorInterpolationFilters="sRGB">
						<feImage
							ref={feImageRef}
							x="0"
							y="0"
							width="100%"
							height="100%"
							result="map"
						/>

						{/* RED */}
						<feDisplacementMap
							ref={redRef}
							in="SourceGraphic"
							in2="map"
							xChannelSelector="R"
							yChannelSelector="G"
							result="dispRed"
						/>

						<feColorMatrix
							in="dispRed"
							type="matrix"
							values="
								1 0 0 0 0
								0 0 0 0 0
								0 0 0 0 0
								0 0 0 1 0
							"
							result="red"
						/>

						{/* GREEN */}
						<feDisplacementMap
							ref={greenRef}
							in="SourceGraphic"
							in2="map"
							xChannelSelector="R"
							yChannelSelector="G"
							result="dispGreen"
						/>

						<feColorMatrix
							in="dispGreen"
							type="matrix"
							values="
								0 0 0 0 0
								0 1 0 0 0
								0 0 0 0 0
								0 0 0 1 0
							"
							result="green"
						/>

						{/* BLUE */}
						<feDisplacementMap
							ref={blueRef}
							in="SourceGraphic"
							in2="map"
							xChannelSelector="R"
							yChannelSelector="G"
							result="dispBlue"
						/>

						<feColorMatrix
							in="dispBlue"
							type="matrix"
							values="
								0 0 0 0 0
								0 0 0 0 0
								0 0 1 0 0
								0 0 0 1 0
							"
							result="blue"
						/>

						<feBlend in="red" in2="green" mode="screen" result="rg" />

						<feBlend in="rg" in2="blue" mode="screen" result="output" />

						<feGaussianBlur
							ref={blurRef}
							in="output"
							stdDeviation={outputBlur}
						/>
					</filter>
				</defs>
			</svg>

			{/*
				Hidden copy used to generate the exact displacement
				image, just like .displacement-debug in the Pen.
			*/}
			<div ref={mapRef} className={styles.displacementMap} aria-hidden="true" />

			<style>{`
				.${styles.effect} {
					backdrop-filter:
						url("#${filterId}")
						saturate(${saturation});
				}
			`}</style>
		</div>
	);
}
