# Search Stats Feature (backend: go-movies-api)

**New public endpoint:** `GET /api/v1/stats/top-searches`

No auth required, standard global rate limit (100 req/min/IP) applies.

## Query parameters

| Param | Required | Values | Notes |
|---|---|---|---|
| `mediaType` | yes | `movie` \| `tvshow` | Exact enum values, case-sensitive |
| `period` | yes | `year` \| `month` \| `week` | Bucket granularity |
| `bucket` | no | e.g. `2026`, `2026-07`, `2026-W30` | Defaults to the **current** bucket for the given period if omitted |
| `limit` | no | positive integer | Defaults to 10, capped at 50 |

Bucket format:
- year → `"2026"`
- month → `"2026-07"`
- week → ISO week, `"2026-W30"`

## Response — `200 OK`

JSON array of `SearchStat`, sorted by `count` descending:

```json
[
  {
    "mediaType": "movie",
    "mediaId": 27205,
    "title": "Inception",
    "period": "week",
    "bucket": "2026-W30",
    "count": 42
  }
]
```

## Error responses

- `400` — invalid `mediaType`, invalid `period`, or non-positive `limit` (plain-text body with the reason)
- `500` — generic "Unexpected error, we will fix soon"

## How the data gets populated

Every time a movie or TV show detail is fetched (cache hit or miss, watchlist or not) via the existing `GET /api/v1/movies/{id}` and `GET /api/v1/tvshows/{id}` handlers, the backend fires an async `RecordSearch` call that upserts/increments counters for that title across all three buckets (year, month, week) simultaneously. So "top searches" really means "most frequently viewed/looked-up titles," not literal search-box queries.

## Frontend integration ideas

- A "Trending this week" or "Popular this month" section on the home page, driven by `period=week` or `period=month` with no `bucket` (defaults to current).
- `mediaId` + `mediaType` map directly to the existing movie/TV detail routes for building links.
- No poster/overview data is included in this response — only `mediaId`/`title`/`count` — so you'll need to fetch full details separately (e.g. via the existing movie/TV detail endpoint or TMDB) if you want poster images.
