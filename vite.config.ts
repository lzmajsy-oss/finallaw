import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 必须显式指向 src，防止打包时解析到根目录导致 React 丢失
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 强制将 CommonJS 模块转换为 ESM，确保生产环境能识别 React Hooks
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
});