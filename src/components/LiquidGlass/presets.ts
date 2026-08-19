import type { LiquidGlassProps } from "./LiquidGlass";

export const toolbarGlassProps: Pick<
	LiquidGlassProps,
	| "radius"
	| "scale"
	| "border"
	| "alpha"
	| "inputBlur"
	| "outputBlur"
	| "red"
	| "green"
	| "blue"
	| "frost"
	| "saturation"
	| "interactive"
	| "dragFollow"
	| "dragDistance"
	| "dragPressScale"
	| "dragDuration"
	| "dragReleaseDuration"
	| "dragStretch"
	| "dragSquash"
	| "dragBounce"
	| "filterPadding"
> = {
	radius: 300,
	scale: -80,
	border: 0,
	alpha: 20,
	inputBlur: 12,
	outputBlur: 1,
	red: 10,
	green: 10,
	blue: 0,
	frost: 0,
	saturation: 1.3,
	interactive: true,
	dragFollow: 0.02,
	dragDistance: 38,
	dragPressScale: 1.03,
	dragDuration: 1.2,
	dragReleaseDuration: 0.8,
	dragStretch: 0.32,
	dragSquash: 0.36,
	dragBounce: 2,
	filterPadding: 32,
};
