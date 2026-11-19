import { defineConfig, globalIgnores } from 'eslint/config'
// typescript-eslint does not support TypeScript 7 yet, so the lint plugins live in the
// tools/eslint workspace with their own TypeScript 6.0 (the project still type-checks with TS 7).
import { js, globals, tseslint, reactHooks, reactRefresh } from '@shree-earthtech/eslint-config'

export default defineConfig([
  globalIgnores(['dist', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    // Warn-only until the existing code is refactored (React Compiler rules, helpers exported
    // next to components, one comma-expression idiom).
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/static-components': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
    },
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
