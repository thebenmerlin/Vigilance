/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Vite Configuration
 * =============================================================================
 * 
 * This file configures Vite, the build tool for the frontend.
 * 
 * Key configurations:
 * - React plugin for JSX/TSX support
 * - Path aliases for clean imports (e.g., @/components)
 * - Dev server settings with CORS for backend communication
 * 
 * TODO: For production, update the proxy target to your deployed backend URL
 * =============================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // React plugin enables Fast Refresh and JSX transform
  plugins: [react()],

  // Path aliases for cleaner imports
  // Instead of: import X from '../../../components/X'
  // Use: import X from '@/components/X'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    // Proxy API requests to backend during development
    // This avoids CORS issues when frontend and backend run on different ports
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // WebSocket proxy for real-time updates
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },

  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
