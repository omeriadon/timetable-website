import "solid-js";

declare module "solid-js" {
	namespace JSX {
		interface HTMLAttributes<T> {
			className?: string;
			key?: string | number;
			htmlFor?: string;
		}

		interface CSSProperties {
			[key: string]: string | number | undefined;
		}
	}
}
