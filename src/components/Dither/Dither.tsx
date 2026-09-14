import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { createRoot, type Root } from "react-dom/client";
import React from "react";

type DitherProps = {
	waveSpeed?: number;
	waveFrequency?: number;
	waveAmplitude?: number;
	waveColor?: [number, number, number];
	backgroundColor?: [number, number, number];
	colorNum?: number;
	pixelSize?: number;
	disableAnimation?: boolean;
	enableMouseInteraction?: boolean;
	mouseRadius?: number;
};

const Dither: Component<DitherProps> = (props) => {
	let host: HTMLDivElement | undefined;
	let root: Root | undefined;
	let ReactComp: React.ComponentType<DitherProps> | undefined;
	let alive = true;

	const render = () => {
		// Read props before the ready-guard so the createEffect below
		// subscribes to them even before the React island has loaded.
		const next = {
			waveSpeed: props.waveSpeed,
			waveFrequency: props.waveFrequency,
			waveAmplitude: props.waveAmplitude,
			waveColor: props.waveColor,
			backgroundColor: props.backgroundColor,
			colorNum: props.colorNum,
			pixelSize: props.pixelSize,
			disableAnimation: props.disableAnimation,
			enableMouseInteraction: props.enableMouseInteraction,
			mouseRadius: props.mouseRadius,
		};
		if (!root || !ReactComp) return;
		root.render(React.createElement(ReactComp, next));
	};

	onMount(() => {
		if (!host) return;
		alive = true;
		root = createRoot(host);
		void import("../Dither.react.js").then(({ default: DitherReact }) => {
			if (!alive) return;
			ReactComp = DitherReact as React.ComponentType<DitherProps>;
			render();
		});
	});

	// Re-render the React island whenever Solid props change. Spreading
	// `{...props}` once would snapshot values and lose reactivity.
	createEffect(() => {
		render();
	});

	onCleanup(() => {
		alive = false;
		root?.unmount();
		root = undefined;
		ReactComp = undefined;
	});

	return (
		<div
			ref={host}
			aria-hidden="true"
			style={{
				position: "absolute",
				inset: "0",
				width: "100%",
				height: "100%",
				display: "block",
				overflow: "hidden",
			}}
		/>
	);
};

export default Dither;
