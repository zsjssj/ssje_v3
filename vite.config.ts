import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import cesium from 'vite-plugin-cesium'
// import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // glsl(),
    // cesium({
    //   rebuildCesium: true
    // })
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables/_colors.scss" as *;
                        @use "@/styles/variables/_typography.scss" as *;
                        @use "@/styles/variables/_spacing.scss" as *;
                        @use "@/styles/variables/_borders.scss" as *;
                        @use "@/styles/variables/_transitions.scss" as *;
                        @use "@/styles/variables/_animations.scss" as *;`
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@fortawesome/fontawesome-free']
        }
      }
    },
    assetsDir: 'assets' // 设置产出目录
  },
  server: {
    port: 5173,
    open: true
  }
})
