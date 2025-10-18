import { defineConfig } from 'vite';

/**
 * Vite configuration for GitHub Pages deployment
 * @see https://vite.dev/config/
 */
export default defineConfig({
  // Base path for GitHub Pages (username.github.io/repo-name/)
  // Change this to your repository name, or use './' for relative paths
  base: './',

  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate sourcemaps for better debugging
    sourcemap: false,
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
  },

  // Development server options
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Preview server options
  preview: {
    port: 4173,
    open: true,
  },
});
