const movies = 'movies/';
const tvShows = 'tv-shows/';
const quotes = 'quotes/';
const users = 'users/';

export default {
  MOVIES: {
    DEFAULT: movies,
    BY_NAME: `${movies}name/`,
    WATCHLIST: `${movies}watchlist`,
  },
  TV_SHOWS: {
    DEFAULT: tvShows,
    BY_NAME: `${tvShows}name/`,
  },
  QUOTES: {
    RANDOM: `${quotes}random`,
  },
  USERS: {
    DEFAULT: `${users}`,
  },
};
