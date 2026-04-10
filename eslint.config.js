import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * ESLint configuration for the React + TypeScript application.
 *
 * This configuration provides comprehensive linting with:
 * - JavaScript recommended rules (@eslint/js)
 * - TypeScript-specific linting (typescript-eslint)
 * - React Hooks validation (eslint-plugin-react-hooks)
 * - React Fast Refresh compatibility checks (eslint-plugin-react-refresh)
 *
 * Configuration details:
 * - Ignores: dist directory (build output)
 * - Target files: All .ts and .tsx files
 * - ECMAScript version: 2020
 * - Environment: Browser globals enabled
 *
 * The React Hooks plugin enforces:
 * - Rules of Hooks (only call at top level, only in React functions)
 * - Exhaustive dependencies in useEffect, useCallback, useMemo
 *
 * The React Refresh plugin ensures:
 * - Components are compatible with Fast Refresh/HMR
 * - Proper export patterns for hot reloading
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/ | ESLint Configuration}
 * @see {@link https://typescript-eslint.io/ | TypeScript ESLint}
 * @see {@link https://react.dev/learn/react-compiler#installing-eslint-plugin-react-compiler | React Hooks Plugin}
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
