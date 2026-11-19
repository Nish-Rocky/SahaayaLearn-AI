/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_DEFAULT_LANGUAGE?: string;
  readonly VITE_DEFAULT_BOARD?: string;
  readonly VITE_DEFAULT_GRADE?: string;
  readonly VITE_VOICE_AUTO_SPEAK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
