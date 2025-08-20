import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@igrp/platform-process-management-client-ts': path.resolve(__dirname, 'packages/@igrp/client/src/index.ts'),
      '@igrp/platform-process-management-types': path.resolve(__dirname, 'packages/@igrp/types/src/index.ts')
    }
  }
});