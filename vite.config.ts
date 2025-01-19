import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from external machines
    port: 5174, // Specify the port
    strictPort: true, // Ensures Vite does not switch ports if 5174 is in use
  },
});
