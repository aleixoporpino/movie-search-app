// Response headers that harden the pages this server sends. The CSP lists the
// few third-party hosts the app really loads; anything else is blocked.
const properties = require('./app.properties');

// The API origin (and its WebSocket twin) is derived from the same value the
// bundle is built with, so the policy can't drift from the app's real API.
const apiOrigins = () => {
  try {
    const { protocol, host } = new URL(String(properties.API_URL));
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
    return [`${protocol}//${host}`, `${wsProtocol}//${host}`];
  } catch (e) {
    return [];
  }
};

const buildCsp = () =>
  [
    "default-src 'self'",
    "script-src 'self'",
    // MUI/emotion inject <style> tags at runtime.
    "style-src 'self' 'unsafe-inline'",
    // data: covers images the bundler inlines.
    "img-src 'self' data: https://image.tmdb.org https://flagcdn.com https://widget.justwatch.com",
    `connect-src 'self' ${apiOrigins().join(' ')}`.trim(),
    // The 404 page embeds a Giphy GIF.
    'frame-src https://giphy.com',
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

const securityHeaders = () => {
  const csp = buildCsp();
  return (req, res, next) => {
    res.set({
      'Content-Security-Policy': csp,
      'Strict-Transport-Security': 'max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });
    next();
  };
};

module.exports = { securityHeaders, buildCsp };
