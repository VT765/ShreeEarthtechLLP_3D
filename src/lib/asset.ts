/** Resolve a file in /public against the deploy base (e.g. a sub-path deploy). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
