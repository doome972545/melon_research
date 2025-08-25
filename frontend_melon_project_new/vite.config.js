import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ให้ Vite ฟังทุกอินเตอร์เฟซ
    port: 5173,       // พอร์ตที่ต้องการใช้
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
