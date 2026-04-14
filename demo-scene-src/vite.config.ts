import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': '/app',
    },
  },
  plugins: [
    TanStackRouterVite({
      routesDirectory: 'app/routes',
      generatedRouteTree: 'app/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
})
