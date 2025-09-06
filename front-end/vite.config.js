import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // Cho phép truy cập từ bên ngoài (0.0.0.0)
    port: 5173,    // Bạn có thể đổi port nếu muốn
  }
})
