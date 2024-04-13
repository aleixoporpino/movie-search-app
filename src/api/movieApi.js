import { api } from './api';
import API_URL from './API_URL';

export const getMovieById = (movieId) => {
  const url = `${API_URL.MOVIES.DEFAULT}${movieId}`;
  return api.get(url);
};

export const getMoviesByName = (name) => {
  const url = `${API_URL.MOVIES.BY_NAME}${name}`;
  return api.get(url);
};

export const saveWatchlist = (movieResult) => {
  const url = `${API_URL.MOVIES.WATCHLIST}`;
  return api.post(url, movieResult);
};
