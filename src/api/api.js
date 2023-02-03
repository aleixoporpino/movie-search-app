import axios from 'axios';
import properties from '../../app.properties';

axios.defaults.baseURL = properties.API_URL || `${window.location.origin}/${properties.API_URL}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export const api = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
