import { api } from './api';
import API_URL from './API_URL';

export const unsubscribeEmail = () => {
  const url = `${API_URL.EMAIL.UNSUBSCRIBE}`;
  return api.post(url);
};

export const resubscribeEmail = () => {
  const url = `${API_URL.EMAIL.RESUBSCRIBE}`;
  return api.post(url);
};
