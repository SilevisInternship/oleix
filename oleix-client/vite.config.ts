import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://oleix-api-gdhe3d5yga-lm.a.run.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
