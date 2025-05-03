import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import tsconfigPaths from 'vite-tsconfig-paths';
import commonJs from "vite-plugin-commonjs";
import federation from '@originjs/vite-plugin-federation';
import dotenv from 'dotenv';
import * as path from 'node:path';
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // tsconfigPaths(),
    react(),
    federation({
      name: 'misa_files',
      filename: 'remoteEntry.js',
      exposes: {
        './FilesApp': './src/App.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    }),
    commonJs(),

  ],
  base: '/files',
  server: {
    port: Number(process.env.PORT || 8001)
  },
  resolve: {
    alias: {
      'services': path.resolve(__dirname, 'src/services'),
      'commonComponents': path.resolve(__dirname, 'src/commonComponents'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'components': path.resolve(__dirname, 'src/components'),
      'common': path.resolve(__dirname, 'src/common'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'types': path.resolve(__dirname, 'src/types'),
      'src': path.resolve(__dirname, 'src'),
    },
  },
  preview: {
    port: Number(process.env.PORT || 8001),
    host: process.env.HOST || 'localhost',
    allowedHosts: ['misaserver.ru', 'localhost']
  },
  build: {
    outDir: 'dist',
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  }
})
