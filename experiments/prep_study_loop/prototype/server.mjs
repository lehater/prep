import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadPublicData, makeHandout } from './data.mjs';
const dist = process.argv.includes('--dist');
const root = fileURLToPath(new URL(dist ? './dist/' : './', import.meta.url));
const type = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const allowed = new Set(['/', '/index.html', '/app.mjs', '/model.mjs', '/style.css', '/participant.json', '/handout.html']);
const port = Number(process.env.PORT ?? '4173');
const host = process.env.HOST ?? '127.0.0.1';
http.createServer(async (req, res) => {
  let path;
  try { path = new URL(req.url, 'http://localhost').pathname; } catch { path = ''; }
  if (!['GET', 'HEAD'].includes(req.method) || !allowed.has(path)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  if (path === '/') path = '/index.html';
  try {
    let content;
    if (!dist && path === '/participant.json') content = JSON.stringify(await loadPublicData());
    else if (!dist && path === '/handout.html') content = makeHandout(await loadPublicData());
    else content = await readFile(root + path.slice(1));
    res.writeHead(200, { 'Content-Type': type[path.slice(path.lastIndexOf('.'))], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (err) { console.error(err); res.writeHead(500); res.end('Failed to load resource'); }
}).listen(port, host, () => console.log(`Prototype: http://${host}:${port}/?arm=A  (also B, C; handout.html for D)`));
