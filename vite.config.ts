import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['node-nowplaying', 'node-nowplaying-win32-x64-msvc']
            }
          }
        }
      },
      {
        entry: 'electron/media-reader.mjs',
        vite: {
          build: {
            rollupOptions: {
              external: ['node-nowplaying', 'node-nowplaying-win32-x64-msvc'],
              output: {
                entryFileNames: 'media-reader.js'
              }
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            lib: {
              entry: 'electron/preload.ts',
              formats: ['cjs']
            },
            rollupOptions: {
              output: {
                entryFileNames: 'preload.js'
              }
            }
          }
        }
      },
    ]),
    renderer(),
  ],
  build: {
    minify: false,
  }
})
