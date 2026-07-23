import { api } from './api';
import API_URL from './API_URL';

export const getTopSearches = ({ mediaType, period, bucket, limit }) => {
  const params = { mediaType, period };
  if (bucket) {
    params.bucket = bucket;
  }
  if (limit) {
    params.limit = limit;
  }

  return api.get(API_URL.STATS.TOP_SEARCHES, { params });
};
