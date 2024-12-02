import process from 'node:process'
import { defineConfig } from 'vite'

const PhaserMsg = () => {
  return {
    name: 'PhaserMsg',
    buildStart() {
      process.stdout.write(`Building for production...\n`)
    },
    buildEnd() {
      process.stdout.write(`Finishing...\n`)
    }
  }
}

export default defineConfig({
  base: './',
  logLevel: 'warning',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    }
  },
  server: {
    // port: 8080,
    host: '0.0.0.0'
  },
  plugins: [PhaserMsg()]
})
