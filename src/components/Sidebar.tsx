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

function distanceBetween(first: RGBColor, second: RGBColor) {
	return Math.hypot(
		first.red - second.red,
		first.green - second.green,
		first.blue - second.blue,
	);
}

function colorFromElement(element: Element): RGBColor | null {
	const style = window.getComputedStyle(element);
	const backgroundColors = style.backgroundImage.match(colorPattern) ?? [];
	const gradientColor = averageColors(
		backgroundColors
			.map(parseColor)
			.filter((color): color is RGBColor => color !== null),
	);

	if (gradientColor) {
		return gradientColor;
	}

	const backgroundColor = parseColor(style.backgroundColor);
	const opacity = Number.parseFloat(style.opacity);

	if (backgroundColor && opacity > 0.05) {
		return backgroundColor;
	}

	return null;
}

function visibleColorAt(x: number, y: number): RGBColor | null {
	const elements = document.elementsFromPoint(x, y);

	for (const element of elements) {
		const color = colorFromElement(element);

		if (color && Math.max(color.red, color.green, color.blue) > 30) {
			return color;
		}
	}

	return null;
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

	const updateReflection = useCallback(() => {
		const sidebar = sidebarRef.current;

		if (!sidebar || window.innerWidth <= 700) {
			return;
		}

		const sidebarBounds = sidebar.getBoundingClientRect();
		const bands: ReflectionBand[] = [];
		const horizontalSamples = [16, 40, 72, 112, 160, 224, 320];
		const sampleHeight = 6;

		for (let offset = 0; offset < sidebarBounds.height; offset += sampleHeight) {
			const y = Math.round(sidebarBounds.top + offset + sampleHeight / 2);
			let color: RGBColor | null = null;

			for (const horizontalOffset of horizontalSamples) {
				const x = Math.round(sidebarBounds.right + horizontalOffset);

				if (x >= window.innerWidth || y >= window.innerHeight) {
					continue;
				}

				color = visibleColorAt(x, y);

				if (color) {
					break;
				}
			}

			if (!color) {
				continue;
			}

			const previousBand = bands.at(-1);

			if (
				previousBand &&
				previousBand.end === offset &&
				distanceBetween(previousBand.color, color) < 38
			) {
				previousBand.end += sampleHeight;
				continue;
			}

			bands.push({
				start: offset,
				end: offset + sampleHeight,
				color,
			});
		}

		sidebar.style.setProperty(
			"--sidebar-reflection",
			reflectionGradient(bands, Math.ceil(sidebarBounds.height)),
		);
	}, []);

	useEffect(() => {
		let animationFrame: number | null = null;

		const scheduleUpdate = () => {
			if (animationFrame !== null) {
				return;
			}

			animationFrame = window.requestAnimationFrame(() => {
				animationFrame = null;
				updateReflection();
			});
		};

		const observer = new MutationObserver(scheduleUpdate);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		window.addEventListener("resize", scheduleUpdate);
		window.addEventListener("scroll", scheduleUpdate, true);
		scheduleUpdate();

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate, true);

			if (animationFrame !== null) {
				window.cancelAnimationFrame(animationFrame);
			}
		};
	}, [pathname, updateReflection]);

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
