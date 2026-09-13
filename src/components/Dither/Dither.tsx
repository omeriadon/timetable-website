import { onCleanup, onMount, type Component } from "solid-js";
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

	onMount(() => {
		if (!host) return;
		root = createRoot(host);
		void import("../Dither.react.js").then(({ default: DitherReact }) => {
			root?.render(
				React.createElement(
					DitherReact as React.ComponentType<DitherProps>,
					{ ...props },
				),
			);
		});
	});

	onCleanup(() => root?.unmount());

	return (
		<div
			ref={host}
			aria-hidden="true"
			style={{ position: "absolute", inset: "0" }}
		/>
	);
};

export default Dither;
