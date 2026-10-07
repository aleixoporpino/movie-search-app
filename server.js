const path = require('path');
const express = require('express');

const app = express();

const KNOWN_ROUTES = [
  /^\/$/,
  /^\/movies$/,
  /^\/movies\/[^/]+$/,
  /^\/tv-shows$/,
  /^\/tv-shows\/[^/]+$/,
  /^\/profile$/,
  /^\/watchlist$/,
  /^\/watchlist\/movies$/,
  /^\/watchlist\/tv-shows$/,
];

// Hashed bundles never change, so cache them for good; everything else (index.html,
// icons, robots.txt, service-worker.js) is revalidated so a deploy shows up right away.
const HASHED_ASSET = /\.[0-9a-f]{16,}\.(js|css)(\.map)?$/;

app.use(
  express.static(path.join(__dirname, 'build'), {
    setHeaders: (res, filePath) => {
      if (HASHED_ASSET.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);
app.get('*', (req, res) => {
  const status = KNOWN_ROUTES.some((route) => route.test(req.path)) ? 200 : 404;
  res.status(status).sendFile('index.html', { root: path.join(__dirname, '/build/') });
});
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('listening on port ', server.address().port);
});
