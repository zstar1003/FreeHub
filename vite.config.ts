import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // GitHub Pages 部署配置
  base: process.env.GITHUB_ACTIONS ? '/FreeHub/' : '/',
})
