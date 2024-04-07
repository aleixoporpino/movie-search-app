import { api } from './api';
import API_URL from './API_URL';

export const getUser = () => {
  const url = `${API_URL.USERS.DEFAULT}`;
  return api.get(url);
};
