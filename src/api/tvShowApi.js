import { api } from './api';
import API_URL from './API_URL';

export const getTvShowById = (tvShowId, name) => {
  const url = `${API_URL.TV_SHOWS.DEFAULT}${tvShowId}`;
  return api.get(url);
};

export const getTvShowsByName = (name) => {
  const url = `${API_URL.TV_SHOWS.BY_NAME}${name}`;
  return api.get(url);
};
