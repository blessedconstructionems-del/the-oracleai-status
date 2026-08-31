// Emergency maintenance worker. Replaces the production /sw.js registration.
const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#070b14">
  <title>The Oracle AI — Temporarily Unavailable</title>
  <style>
    *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;background:#070b14;color:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center}main{width:min(680px,100%);padding:48px 32px;border:1px solid #293246;border-radius:24px;background:#0f1625}h1{margin:0;font-size:clamp(34px,9vw,58px);line-height:1.06}p{margin:24px auto 0;max-width:520px;color:#b9c2d3;font-size:19px;line-height:1.6}
  </style>
</head>
<body><main><h1>Our servers are temporarily unavailable.</h1><p>We’re working urgently to restore service. Please check back shortly.</p></main></body>
</html>`;

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name.startsWith('oracle-ai-v'))
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;

  event.respondWith((async () => {
    try {
      return await fetch(event.request, { cache: 'no-store' });
    } catch (_) {
      return new Response(MAINTENANCE_HTML, {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    }
  })());
});
