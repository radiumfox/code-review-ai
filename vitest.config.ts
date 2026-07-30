import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        external: ['react', 'zod'],
      },
    },
    environment: 'jsdom',
    exclude: ['tests/**', 'node_modules/**']
  },
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    }
  },
});