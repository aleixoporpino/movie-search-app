const fs = require('fs');
const path = require('path');
const express = require('express');
const { fetchTitle, renderTitlePage, buildSitemap } = require('./seo');

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

const TITLE_ROUTE = /^\/(movies|tv-shows)\/(\d{1,9})$/;

const BUILD_DIR = path.join(__dirname, 'build');
let indexTemplate;
const getIndexTemplate = () => {
  if (!indexTemplate) {
    indexTemplate = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
  }
  return indexTemplate;
};

// Hashed bundles never change, so cache them for good; everything else (index.html,
// icons, robots.txt, service-worker.js) is revalidated so a deploy shows up right away.
const HASHED_ASSET = /\.[0-9a-f]{16,}\.(js|css)(\.map)?$/;

// Lists the most-searched titles on top of the static pages. If the API is
// unreachable this falls through to the static sitemap.xml in the build.
app.get('/sitemap.xml', async (req, res, next) => {
  const xml = await buildSitemap();
  if (!xml) {
    next();
    return;
  }
  res.set('Cache-Control', 'public, max-age=3600').type('application/xml').send(xml);
});

app.use(
  express.static(BUILD_DIR, {
    index: false,
    setHeaders: (res, filePath) => {
      if (HASHED_ASSET.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }),
);

app.get('*', async (req, res) => {
  const known = KNOWN_ROUTES.some((route) => route.test(req.path));
  res.set('Cache-Control', 'no-cache');

  const titleMatch = TITLE_ROUTE.exec(req.path);
  if (titleMatch) {
    const [, kind, id] = titleMatch;
    const data = await fetchTitle(kind, id);
    if (data && data.notFound) {
      res.status(404).type('html').send(getIndexTemplate());
      return;
    }
    if (data) {
      res.status(200).type('html').send(renderTitlePage(getIndexTemplate(), kind, data, req.path));
      return;
    }
  }

  res
    .status(known ? 200 : 404)
    .type('html')
    .send(getIndexTemplate());
});
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('listening on port ', server.address().port);
});
