import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		turbopackFileSystemCacheForDev: false,
	},
	turbopack: {
		root: process.cwd(),
	},
};

export default nextConfig;
