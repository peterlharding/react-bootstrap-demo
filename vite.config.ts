import {loadEnv} from 'vite';
import {configDefaults, defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

const DEFAULT_PORT = 3004;

const parsePort = (value: string | undefined) => {
  if (!value) return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`APP_PORT must be a port number between 1 and 65535, got "${value}"`);
  }
  return port;
};

export default defineConfig(({mode}) => {
  // HOST and APP_PORT come from .env (see setup/env.template) or the shell environment.
  // They have no VITE_ prefix, so they configure the dev server without reaching client code.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      rolldownOptions: {
        output: {
          // Split large third-party libraries into their own long-cacheable chunks.
          codeSplitting: {
            groups: [
              {name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/},
              {name: 'vendor', test: /node_modules[\\/]/},
            ],
          },
        },
      },
    },
    server: {
      host: env.HOST || undefined,
      port: parsePort(env.APP_PORT),
      strictPort: true,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['src/test/setup.ts'],
      // e2e/ holds Playwright specs, run with `npm run test:e2e`.
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  };
});
