import { api } from './api';
import API_URL from './API_URL';

export const getStatus = () => api.get(API_URL.STATUS.DEFAULT);
