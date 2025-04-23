import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import commonJs from "vite-plugin-commonjs";
import { federation } from "@module-federation/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    commonJs(),
    federation({
      name: 'misa_files',
      filename: 'remoteEntry.js',
      exposes: {
        './FilesApp': './src/App.tsx'
      },
      shared: {
        "react": {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        'react-router-dom': {
          singleton: true,
        },
        'antd': {
          singleton: true,
        }
      },
    })
  ],
  css: {
    devSourcemap: false,
  },
  esbuild: {
    target: 'esnext'
  },
  server: {
    port: 8001
  },
  preview: {
    port: 8001,
    allowedHosts: ['misaserver.ru', 'localhost']
  },
  base: '/',
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist',
  },
})
