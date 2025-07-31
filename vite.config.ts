import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Proxy error - Backend server may not be running:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🔄 Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📡 Proxy response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
