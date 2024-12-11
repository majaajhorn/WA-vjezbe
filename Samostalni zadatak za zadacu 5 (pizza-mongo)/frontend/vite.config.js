import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {}, // Provides process.env as an empty object if needed
  },
  resolve: {
    alias: {
      // Fallback to 'process/browser' when 'process' is required
      process: 'process/browser',
    },
  },
});
