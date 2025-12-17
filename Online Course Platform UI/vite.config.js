import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http: ws: wss:;"
    }
  }
})
