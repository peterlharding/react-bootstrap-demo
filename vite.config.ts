/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Split large third-party libraries into their own long-cacheable chunks.
        codeSplitting: {
          groups: [
            {name: 'lorem', test: /node_modules[\\/]react-lorem-ipsum/},
            {name: 'vendor', test: /node_modules[\\/]/},
          ],
        },
      },
    },
  },
  server: {
    port: 3004,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
