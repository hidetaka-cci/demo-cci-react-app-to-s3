import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite build configuration for the React application.
 *
 * This configuration enables:
 * - React plugin with Fast Refresh for instant HMR during development
 * - JSX/TSX transformation support
 * - Optimized production builds with tree-shaking and minification
 *
 * The React plugin provides:
 * - Automatic JSX runtime configuration
 * - React Fast Refresh for component-level hot module replacement
 * - Development-time error overlays
 *
 * @see {@link https://vite.dev/config/ | Vite Configuration Reference}
 * @see {@link https://github.com/vitejs/vite-plugin-react | @vitejs/plugin-react Documentation}
 */
export default defineConfig({
  plugins: [react()],
})
