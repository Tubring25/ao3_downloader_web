import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/api/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
});