import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  server: { port: 3000, strictPort: true },
  plugins: [
    devtools({ eventBusConfig: { port: 4206 } }),
    tailwindcss(),
    ...(command === "build"
      ? [cloudflare({ viteEnvironment: { name: "ssr" } })]
      : []),
    tanstackStart(),
    viteReact(),
  ],
}))

export default config
