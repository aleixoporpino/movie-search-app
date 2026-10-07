// Server-side page metadata for crawlers. The app is a client-rendered SPA, so
// the HTML a crawler first receives has no title, description or content for a
// movie page. These helpers fill them in from the API before the HTML is sent;
// the client's Helmet then takes over (the tags carry data-rh="true").
const properties = require('./app.properties');

const SITE_URL = 'https://findmovies.ca';
const SITE_NAME = 'Search Movies and TV Shows';
const API_URL = String(properties.API_URL || '');

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 1000;
const FETCH_TIMEOUT_MS = 4000;

const cache = new Map();

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Keeps third-party text (overviews) from closing the script element.
const escapeJsonForScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const getJson = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Accept: 'application/json', 'X-Skip-Search-Stat': '1' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${endpoint} responded ${response.status}`);
  }
  return response.json();
};

const remember = (key, value) => {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
};

// Resolves to the title's data, `{ notFound: true }` for an unknown id, or null
// when the API can't be reached (callers fall back to the plain page).
const fetchTitle = async (kind, id) => {
  const key = `${kind}/${id}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.value;
  }
  try {
    const data = await getJson(key);
    const value = data && data.id ? data : { notFound: true };
    remember(key, value);
    return value;
  } catch (e) {
    return null;
  }
};

const buildMeta = (kind, data, pathname) => {
  const title = `${data.originalTitle} - Where to watch | ${SITE_NAME}`;
  const description =
    (data.overview && data.overview.slice(0, 160)) ||
    `Find out where to stream ${data.originalTitle}, including which countries it's available in.`;
  const canonical = `${SITE_URL}${pathname}`;
  const image = data.posterPath ? `https://image.tmdb.org/t/p/w500/${data.posterPath}` : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': kind === 'movies' ? 'Movie' : 'TVSeries',
    name: data.originalTitle,
    description: data.overview,
    image,
    aggregateRating: data.voteAverage
      ? {
          '@type': 'AggregateRating',
          ratingValue: data.voteAverage,
          ratingCount: data.voteCount || 1,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
  };

  return { title, description, canonical, image, jsonLd };
};

const renderTitlePage = (template, kind, data, pathname) => {
  const { title, description, canonical, image, jsonLd } = buildMeta(kind, data, pathname);
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const c = escapeHtml(canonical);

  const tags = [
    `<link rel="canonical" href="${c}" data-rh="true"/>`,
    `<meta property="og:type" content="${
      kind === 'movies' ? 'video.movie' : 'website'
    }" data-rh="true"/>`,
    `<meta property="og:title" content="${t}" data-rh="true"/>`,
    `<meta property="og:description" content="${d}" data-rh="true"/>`,
    `<meta property="og:url" content="${c}" data-rh="true"/>`,
    image && `<meta property="og:image" content="${escapeHtml(image)}" data-rh="true"/>`,
    `<meta name="twitter:card" content="${
      image ? 'summary_large_image' : 'summary'
    }" data-rh="true"/>`,
    `<meta name="twitter:title" content="${t}" data-rh="true"/>`,
    `<meta name="twitter:description" content="${d}" data-rh="true"/>`,
    image && `<meta name="twitter:image" content="${escapeHtml(image)}" data-rh="true"/>`,
    `<script type="application/ld+json" data-rh="true">${escapeJsonForScript(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('');

  // Function replacers: the inserted text must not be read for `$&`-style patterns.
  return template
    .replace(/<title>[^<]*<\/title>/, () => `<title>${t}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      () => `<meta name="description" content="${d}" data-rh="true"/>`,
    )
    .replace('</head>', () => `${tags}</head>`)
    .replace(
      '<div id="root"></div>',
      () => `<div id="root"><h1>${escapeHtml(data.originalTitle)}</h1><p>${d}</p></div>`,
    );
};

module.exports = { fetchTitle, renderTitlePage };
