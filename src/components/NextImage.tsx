import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
	fill?: boolean;
	priority?: boolean;
	unoptimized?: boolean;
};

export default function NextImage({ fill, priority, unoptimized, ...props }: Props) {
	return <img {...props} />;
}
