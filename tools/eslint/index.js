// Re-exports the lint plugins from this workspace so they resolve against its own TypeScript 6.0.
export { default as js } from '@eslint/js'
export { default as globals } from 'globals'
export { default as tseslint } from 'typescript-eslint'
export { default as reactHooks } from 'eslint-plugin-react-hooks'
export { default as reactRefresh } from 'eslint-plugin-react-refresh'
