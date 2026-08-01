import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import 'dotenv/config';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/api/*', async (req, res) => {
    const tmdbToken = process.env['TMDB_ACCESS_TOKEN'] || process.env['TMDB_API_KEY'];

    if (!tmdbToken) {
      res.status(500).json({ error: 'TMDB token is not configured on the server.' });
      return;
    }

    const targetPath = req.path.replace(/^\/api/, '');
    const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const upstreamUrl = new URL(`https://api.themoviedb.org/3${targetPath}${queryString}`);

    try {
      const response = await fetch(upstreamUrl, {
        headers: {
          Authorization: `Bearer ${tmdbToken}`,
          accept: 'application/json',
        },
      });

      const body = await response.text();
      res.status(response.status);
      res.setHeader('content-type', response.headers.get('content-type') ?? 'application/json');
      res.send(body);
    } catch (error) {
      console.error('TMDB proxy error:', error);
      res.status(502).json({ error: 'Failed to reach TMDB.' });
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
