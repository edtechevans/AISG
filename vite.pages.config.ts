import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import path from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  base: process.env.PAGES_BASE_PATH || '/',
  root: path.join(projectRoot, 'pages'),
  publicDir: path.join(projectRoot, 'public'),
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'next/link', replacement: path.join(projectRoot, 'pages/src/next-link.tsx') },
      { find: '@', replacement: projectRoot },
    ],
  },
  build: {
    outDir: path.join(projectRoot, 'pages-dist'),
    emptyOutDir: true,
  },
});
