/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint for the enquiry form (Formspree / Web3Forms compatible). Unset → mailto fallback. */
  readonly VITE_FORM_ENDPOINT?: string
  /** Optional access key sent as `access_key` in the JSON body (required by Web3Forms). */
  readonly VITE_FORM_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
