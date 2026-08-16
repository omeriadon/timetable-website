"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const navItems = [
	{ label: "Overview", href: "/", icon: "chart.bar.xaxis.svg" },
	{
		label: "Schedule",
		href: "/timetable",
		icon: "calendar.day.timeline.left.svg",
	},
	{ label: "Classes", href: "/classes", icon: "person.2.svg" },
	{ label: "Settings", href: "/settings", icon: "gear.svg" },
];

type RGBColor = {
	red: number;
	green: number;
	blue: number;
};

type ReflectionSurface = {
	element: HTMLElement;
	color: RGBColor;
};

type ReflectionBand = {
	start: number;
	end: number;
	color: RGBColor;
};

const colorPattern = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;

function parseColor(value: string): RGBColor | null {
	if (value.startsWith("#")) {
		const hex = value.slice(1);
		const expanded =
			hex.length === 3 || hex.length === 4
				? hex
						.slice(0, 3)
						.split("")
						.map((character) => `${character}${character}`)
						.join("")
				: hex.slice(0, 6);

		if (expanded.length !== 6) {
			return null;
		}

		return {
			red: Number.parseInt(expanded.slice(0, 2), 16),
			green: Number.parseInt(expanded.slice(2, 4), 16),
			blue: Number.parseInt(expanded.slice(4, 6), 16),
		};
	}

	const channels = value.match(/rgba?\(([^)]*)\)/i)?.[1]
		.split(/[\s,\/]+/)
		.filter(Boolean)
		.map(Number);

	if (!channels || channels.length < 3 || channels.some(Number.isNaN)) {
		return null;
	}

	return {
		red: channels[0],
		green: channels[1],
		blue: channels[2],
	};
}

function averageColors(colors: RGBColor[]): RGBColor | null {
	if (colors.length === 0) {
		return null;
	}

	const total = colors.reduce(
		(sum, color) => ({
			red: sum.red + color.red,
			green: sum.green + color.green,
			blue: sum.blue + color.blue,
		}),
		{ red: 0, green: 0, blue: 0 },
	);

	return {
		red: Math.round(total.red / colors.length),
		green: Math.round(total.green / colors.length),
		blue: Math.round(total.blue / colors.length),
	};
}

function imageColor(image: HTMLImageElement): RGBColor | null {
	if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
		return null;
	}

	try {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		const context = canvas.getContext("2d", { willReadFrequently: true });

		if (!context) {
			return null;
		}

		context.drawImage(image, 0, 0, 1, 1);
		const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;

		if (alpha < 16) {
			return null;
		}

		return { red, green, blue };
	} catch {
		return null;
	}
}

function colorFromElement(element: HTMLElement): RGBColor | null {
	if (element instanceof HTMLImageElement) {
		return imageColor(element);
	}

	const style = window.getComputedStyle(element);
	const gradientColor = averageColors(
		(style.backgroundImage.match(colorPattern) ?? [])
			.map(parseColor)
			.filter((color): color is RGBColor => color !== null),
	);

	if (gradientColor) {
		return gradientColor;
	}

	return parseColor(style.backgroundColor);
}

function isReflectable(color: RGBColor) {
	const brightest = Math.max(color.red, color.green, color.blue);
	const darkest = Math.min(color.red, color.green, color.blue);

	return brightest > 44 && brightest - darkest > 18;
}

function reflectionGradient(bands: ReflectionBand[], height: number) {
	if (bands.length === 0) {
		return "transparent";
	}

	const stops = ["transparent 0px"];

	for (const band of bands) {
		const color = `rgb(${band.color.red} ${band.color.green} ${band.color.blue})`;
		stops.push(`transparent ${Math.max(0, band.start - 1)}px`);
		stops.push(`${color} ${band.start}px`);
		stops.push(`${color} ${band.end}px`);
		stops.push(`transparent ${Math.min(height, band.end + 1)}px`);
	}

	stops.push(`transparent ${height}px`);

	return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function Sidebar() {
	const pathname = usePathname();
	const sidebarRef = useRef<HTMLElement>(null);
	const surfacesRef = useRef<ReflectionSurface[]>([]);
	const reflectionRef = useRef("");

	const writeReflection = useCallback(() => {
		const sidebar = sidebarRef.current;

		if (!sidebar || window.innerWidth <= 700) {
			return;
		}

		const sidebarBounds = sidebar.getBoundingClientRect();
		const bands = surfacesRef.current
			.map(({ element, color }) => {
				const bounds = element.getBoundingClientRect();
				const start = Math.max(0, Math.round(bounds.top - sidebarBounds.top));
				const end = Math.min(
					Math.ceil(sidebarBounds.height),
					Math.round(bounds.bottom - sidebarBounds.top),
				);

				if (bounds.right <= sidebarBounds.right || start >= end) {
					return null;
				}

				return { start, end, color };
			})
			.filter((band): band is ReflectionBand => band !== null)
			.sort((first, second) => first.start - second.start);
		const reflection = reflectionGradient(
			bands,
			Math.ceil(sidebarBounds.height),
		);

		if (reflection === reflectionRef.current) {
			return;
		}

		reflectionRef.current = reflection;
		sidebar.style.setProperty("--sidebar-reflection", reflection);
	}, []);

	const collectSurfaces = useCallback(() => {
		const sidebar = sidebarRef.current;

		if (!sidebar || window.innerWidth <= 700) {
			surfacesRef.current = [];
			return;
		}

		const sidebarBounds = sidebar.getBoundingClientRect();
		const searchLimit = sidebarBounds.right + 480;

		surfacesRef.current = Array.from(
			document.querySelectorAll<HTMLElement>("body *"),
		).flatMap((element) => {
			if (sidebar.contains(element)) {
				return [];
			}

			const bounds = element.getBoundingClientRect();

			if (
				bounds.width < 80 ||
				bounds.height < 12 ||
				bounds.width * bounds.height < 2_000 ||
				bounds.right <= sidebarBounds.right ||
				bounds.left >= searchLimit
			) {
				return [];
			}

			const color = colorFromElement(element);

			return color && isReflectable(color) ? [{ element, color }] : [];
		});
		writeReflection();
	}, [writeReflection]);

	useEffect(() => {
		let animationFrame: number | null = null;

		const scheduleWrite = () => {
			if (animationFrame !== null) {
				return;
			}

			animationFrame = window.requestAnimationFrame(() => {
				animationFrame = null;
				writeReflection();
			});
		};

		const refreshSurfaces = () => {
			collectSurfaces();
			scheduleWrite();
		};

		const observer = new MutationObserver(refreshSurfaces);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		const resizeObserver = new ResizeObserver(refreshSurfaces);
		const sidebar = sidebarRef.current;

		if (sidebar) {
			resizeObserver.observe(sidebar);
		}

		window.addEventListener("resize", refreshSurfaces);
		window.addEventListener("load", refreshSurfaces);
		window.addEventListener("scroll", scheduleWrite, true);
		refreshSurfaces();

		return () => {
			observer.disconnect();
			resizeObserver.disconnect();
			window.removeEventListener("resize", refreshSurfaces);
			window.removeEventListener("load", refreshSurfaces);
			window.removeEventListener("scroll", scheduleWrite, true);

			if (animationFrame !== null) {
				window.cancelAnimationFrame(animationFrame);
			}
		};
	}, [collectSurfaces, pathname, writeReflection]);

	return (
		<aside
			ref={sidebarRef}
			className={styles.sidebar}
			aria-label="Sidebar navigation"
		>
			<Image
				src="/icon.png"
				alt="Photo"
				loading="eager"
				width={100}
				height={100}
			/>

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{navItems.map((item) => {
					return (
						<Link
							key={item.href}
							href={item.href}
							className={
								pathname === item.href
									? `${styles.sidebarLink} ${styles.active}`
									: styles.sidebarLink
							}
							aria-current={pathname === item.href ? "page" : undefined}
						>
							<img
								className={styles.navIcon}
								src={`/icons/${item.icon}`}
								alt=""
								loading="eager"
								aria-hidden="true"
							/>
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
