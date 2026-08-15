declare module "liquid-gl" {
	type LiquidGLOptions = {
		target: string;
		snapshot?: string;
		resolution?: number;
		refraction?: number;
		aberration?: number;
		bevelDepth?: number;
		bevelWidth?: number;
		frost?: number;
		shadow?: boolean;
		specular?: boolean;
		reveal?: "fade" | "none";
		tilt?: boolean;
		magnify?: number;
	};

	export default function liquidGL(options: LiquidGLOptions): unknown;
}
