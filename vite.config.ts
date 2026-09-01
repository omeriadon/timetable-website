import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
	resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
	plugins: [tanstackStart(), tanstackRouter({ target: "react", autoCodeSplitting: true }), tailwindcss(), viteReact()],
	server: { port: 3000 },
});
