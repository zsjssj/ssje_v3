import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium({
      rebuildCesium: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@c': path.resolve(__dirname, './src/components'),
      '@a': path.resolve(__dirname, './src/assets'),
      '@u': path.resolve(__dirname, './src/utils'),
      '@v': path.resolve(__dirname, './src/views')
    }
  },
  build: {
    assetsDir: 'assets' // 设置产出目录
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@a/styles/mixin.scss" as *;`
      }
    }
  }
})
