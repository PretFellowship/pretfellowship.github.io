import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const fs = require('node:fs')
const path = require('node:path')
const { mergeEvents } = require('./scripts/merge-events.cjs')

function eventsJsonPlugin() {
  return {
    name: 'events-json',
    configureServer(server) {
      mergeEvents()

      server.watcher.add(path.resolve(process.cwd(), 'data'))
      server.watcher.on('change', (file) => {
        if (file.endsWith('.json') && !file.endsWith(`${path.sep}events.json`)) {
          mergeEvents()
        }
      })

      server.middlewares.use('/data/events.json', (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next()
          return
        }

        const eventsPath = path.resolve(process.cwd(), 'dist', 'data', 'events.json')

        try {
          const eventsJson = fs.readFileSync(eventsPath)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(req.method === 'HEAD' ? undefined : eventsJson)
        } catch (error) {
          next(error)
        }
      })
    },
    closeBundle() {
      mergeEvents()
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    eventsJsonPlugin(),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
