import { api } from './api';
import API_URL from './API_URL';

export const getProvidersById = (tvShowId) => {
  const url = `${API_URL.TV_SHOWS.PROVIDERS_BY_ID.replace('{tvShowId}', tvShowId)}`;
  return api.get(url);
};

export const getTvShowById = (tvShowId) => {
  const url = `${API_URL.TV_SHOWS.DEFAULT}${tvShowId}`;
  return api.get(url);
};

export const getTvShowsByName = (name) => {
  const url = `${API_URL.TV_SHOWS.BY_NAME}${name}`;
  return api.get(url);
};

export const saveTvShowWatchlist = (movieResult) => {
  const url = `${API_URL.TV_SHOWS.WATCHLIST}`;
  return api.post(url, movieResult);
};
