import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        thanks: resolve('thanks.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
          charts: ['recharts'],
          utils: ['xlsx', 'jspdf', 'jspdf-autotable', 'file-saver']
        }
      }
    },
  },
});