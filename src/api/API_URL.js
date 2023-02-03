const movies = 'movies/';
const tvShows = 'tv-shows/';
const quotes = 'quotes/';

export default {
  MOVIES: {
    DEFAULT: movies,
    BY_NAME: `${movies}name/`,
  },
  TV_SHOWS: {
    DEFAULT: tvShows,
    BY_NAME: `${tvShows}name/`,
  },
  QUOTES: {
    RANDOM: `${quotes}random`,
  },
};
