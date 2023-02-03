import { api } from './api';
import API_URL from './API_URL';

export const getRandomQuote = () => {
  const url = `${API_URL.QUOTES.RANDOM}`;
  return api.get(url);
};
