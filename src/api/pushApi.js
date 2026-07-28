import { api } from './api';
import API_URL from './API_URL';

export const getVapidPublicKey = () => {
  const url = `${API_URL.PUSH.VAPID_PUBLIC_KEY}`;
  return api.get(url);
};

export const subscribePush = (subscription) => {
  const url = `${API_URL.PUSH.SUBSCRIBE}`;
  return api.post(url, subscription);
};

export const unsubscribePush = (endpoint) => {
  const url = `${API_URL.PUSH.UNSUBSCRIBE}`;
  return api.post(url, { endpoint });
};
