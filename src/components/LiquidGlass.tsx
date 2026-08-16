"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import gsap from "gsap";
import styles from "./LiquidGlass.module.css";

type LiquidGlassProps = {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	onClick?: () => void;
	interactive?: boolean;
	dragFollow?: number;
	dragDistance?: number;
	dragPressScale?: number;
	dragDuration?: number;
	dragReleaseDuration?: number;
	dragStretch?: number;
	dragSquash?: number;
	dragBounce?: number;
	filterPadding?: number;

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
	interactive = false,
	dragFollow = 0.18,
	dragDistance = 18,
	dragPressScale = 1.04,
	dragDuration = 0.75,
	dragReleaseDuration = 1.1,
	dragStretch = 0.12,
	dragSquash = 0.06,
	dragBounce = 0.25,
	filterPadding = 32,

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
	const pointerDownRef = useRef(false);
	const [rootSize, setRootSize] = useState({ width: 0, height: 0 });

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

			setRootSize({ width, height });

			const displacementBorder = Math.min(width, height) * (border * 0.5);

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

	const animateToPointer = (clientX: number, clientY: number) => {
		const root = rootRef.current;

		if (!root) {
			return;
		}

		const rect = root.getBoundingClientRect();
		const offsetX = clientX - (rect.left + rect.width / 2);
		const offsetY = clientY - (rect.top + rect.height / 2);
		const distance = Math.hypot(offsetX, offsetY);
		const intensity = Math.min(distance / Math.max(rect.width, rect.height), 1);
		const travel =
			dragDistance * (1 - Math.exp(-(distance * dragFollow) / dragDistance));
		const targetX = distance === 0 ? 0 : (offsetX / distance) * travel;
		const targetY = distance === 0 ? 0 : (offsetY / distance) * travel;
		const directionMagnitudeX =
			distance === 0 ? 0 : Math.abs(offsetX / distance);
		const directionMagnitudeY =
			distance === 0 ? 0 : Math.abs(offsetY / distance);
		const horizontalStretch =
			intensity *
			(dragStretch * (0.35 + directionMagnitudeX * 0.65) -
				dragSquash * directionMagnitudeY * 0.65);
		const verticalStretch =
			intensity *
			(dragStretch * (0.35 + directionMagnitudeY * 0.65) -
				dragSquash * directionMagnitudeX * 0.65);

		gsap.to(root, {
			x: targetX,
			y: targetY,
			scaleX: dragPressScale * (1 + horizontalStretch),
			scaleY: dragPressScale * (1 + verticalStretch),
			rotation: 0,
			duration: dragDuration,
			ease: `elastic.out(${dragBounce}, 0.7)`,
			overwrite: true,
		});
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!interactive) {
			return;
		}

		pointerDownRef.current = true;
		event.currentTarget.setPointerCapture(event.pointerId);
		window.addEventListener("pointerup", releaseToOrigin);
		window.addEventListener("pointercancel", releaseToOrigin);
		event.preventDefault();
		animateToPointer(event.clientX, event.clientY);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!interactive || !pointerDownRef.current) {
			return;
		}

		event.preventDefault();
		animateToPointer(event.clientX, event.clientY);
	};

	const releaseToOrigin = () => {
		pointerDownRef.current = false;

		window.removeEventListener("pointerup", releaseToOrigin);
		window.removeEventListener("pointercancel", releaseToOrigin);

		const root = rootRef.current;

		if (!root) {
			return;
		}

		gsap.to(root, {
			x: 0,
			y: 0,
			scaleX: 1,
			scaleY: 1,
			rotation: 0,
			duration: dragReleaseDuration,
			ease: `elastic.out(${dragBounce}, 0.8)`,
			overwrite: true,
		});
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!interactive) {
			return;
		}

		if (event.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}

		releaseToOrigin();
	};

	return (
		<div
			ref={rootRef}
			className={`${styles.effect} ${
				interactive ? styles.interactive : ""
			} ${className ?? ""}`}
			onClick={onClick}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
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
					<filter
						id={filterId}
						colorInterpolationFilters="sRGB"
						filterUnits="userSpaceOnUse"
						x={-filterPadding}
						y={-filterPadding}
						width={rootSize.width + filterPadding * 2}
						height={rootSize.height + filterPadding * 2}
					>
						<feImage
							ref={feImageRef}
							x="0"
							y="0"
							width={rootSize.width}
							height={rootSize.height}
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
