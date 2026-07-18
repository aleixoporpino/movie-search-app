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

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  const status = KNOWN_ROUTES.some((route) => route.test(req.path)) ? 200 : 404;
  res.status(status).sendFile('index.html', { root: path.join(__dirname, '/build/') });
});
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('listening on port ', server.address().port);
});
