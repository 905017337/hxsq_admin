import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');


export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  server: {
    host: 'localhost',
    port: 8088,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000"
    //   }
    // }
  },
  plugins: [vue()]
})
