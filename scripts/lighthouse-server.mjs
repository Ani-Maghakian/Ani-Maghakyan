import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { createBrotliCompress, createGzip } from 'node:zlib';

const root = resolve('dist/client');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

function diskPath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, '');
  let path = join(root, safe);
  if (!extname(path) || urlPath.endsWith('/')) path = join(path, 'index.html');
  return path;
}

function compressible(type) {
  return /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/.test(type);
}

const server = createServer((req, res) => {
  const path = diskPath(req.url || '/');
  if (!path.startsWith(root) || !existsSync(path) || !statSync(path).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const type = mime[extname(path).toLowerCase()] || 'application/octet-stream';
  const headers = {
    'content-type': type,
    'cache-control': 'public, max-age=31536000, immutable',
    'vary': 'Accept-Encoding',
  };
  if (extname(path) === '.html') headers['cache-control'] = 'no-cache';

  const accepted = req.headers['accept-encoding'] || '';
  const source = createReadStream(path);
  if (compressible(type) && accepted.includes('br')) {
    res.writeHead(200, { ...headers, 'content-encoding': 'br' });
    source.pipe(createBrotliCompress()).pipe(res);
  } else if (compressible(type) && accepted.includes('gzip')) {
    res.writeHead(200, { ...headers, 'content-encoding': 'gzip' });
    source.pipe(createGzip()).pipe(res);
  } else {
    res.writeHead(200, headers);
    source.pipe(res);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Lighthouse compressed server ready on http://127.0.0.1:${port}`);
});
