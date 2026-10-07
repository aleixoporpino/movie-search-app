// Sends www.findmovies.ca to findmovies.ca so each page has a single address
// for visitors, bookmarks and search engines. Any other host (localhost, the
// Fly hostname) is left alone.
const APEX_HOST = 'findmovies.ca';
const WWW_HOST = `www.${APEX_HOST}`;

const redirectWwwToApex = (req, res, next) => {
  const host = String(req.headers.host || '')
    .toLowerCase()
    .replace(/:\d+$/, '');
  if (host !== WWW_HOST) {
    next();
    return;
  }
  // originalUrl keeps the path and query string; 301 so search engines move over.
  res.redirect(301, `https://${APEX_HOST}${req.originalUrl}`);
};

module.exports = { redirectWwwToApex };
