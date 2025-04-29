import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import commonJs from "vite-plugin-commonjs";
import { federation } from "@module-federation/vite";
import dotenv from 'dotenv';
dotenv.config();

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
        },
        'dayjs': {
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
    port: Number(process.env.PORT || 8001)
  },
  preview: {
    port: Number(process.env.PORT || 8001),
    host: process.env.HOST || 'localhost',
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
