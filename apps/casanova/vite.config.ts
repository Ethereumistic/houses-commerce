import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 3000, strictPort: true },
  plugins: [
    devtools({ eventBusConfig: { port: 4206 } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
