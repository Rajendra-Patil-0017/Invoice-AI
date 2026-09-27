import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

// Custom Vite plugin to handle /api/analyze locally in dev server
function apiServerPlugin() {
  return {
    name: 'local-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/analyze') {
          // Dynamic import of handler
          try {
            const { default: handler } = await import('./api/analyze.js');

            // Read request body stream
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            let parsedBody = {};
            if (data) {
              try {
                parsedBody = JSON.parse(data);
              } catch {
                parsedBody = data;
              }
            }
            req.body = parsedBody;

            // Mock Express/Vercel response helpers for Vite Connect middleware
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (obj) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(obj));
              return res;
            };

            await handler(req, res);
          } catch (err) {
            console.error('Local API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiServerPlugin()],
});
