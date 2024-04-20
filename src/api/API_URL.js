const movies = 'movies/';
const tvShows = 'tv-shows/';
const quotes = 'quotes/';
const users = 'users/';

export default {
  MOVIES: {
    DEFAULT: movies,
    BY_NAME: `${movies}name/`,
    PROVIDERS_BY_ID: `${movies}{movieId}/providers`,
    WATCHLIST: `${movies}watchlist`,
  },
  TV_SHOWS: {
    DEFAULT: tvShows,
    BY_NAME: `${tvShows}name/`,
    PROVIDERS_BY_ID: `${tvShows}{tvShowId}/providers`,
    WATCHLIST: `${tvShows}watchlist`,
  },
  QUOTES: {
    RANDOM: `${quotes}random`,
  },
  USERS: {
    DEFAULT: `${users}`,
  },
};
