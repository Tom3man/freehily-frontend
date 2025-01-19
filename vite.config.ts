import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/freehily",
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
  },
  esbuild: {
    jsx: "automatic",
  },
  build: {
    target: "es2020",
  },
});
