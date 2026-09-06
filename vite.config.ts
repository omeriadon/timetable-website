import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteSolid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	plugins: [
		tanstackStart(),
		nitro({
			preset: "bun",
			routeRules: {
				"/landing/**": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/fonts/**": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/icons/**": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/grain.webp": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/hdr-white.avif": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/favicon.svg": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
				"/icon-512.webp": {
					headers: {
						"cache-control": "public, max-age=604800",
					},
				},
			},
		}),
		tailwindcss(),
		viteSolid({ ssr: true }),
	],
	server: { port: 3000 },
});
