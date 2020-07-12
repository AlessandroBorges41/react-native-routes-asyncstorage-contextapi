import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://Localhost:3333',
  baseURL: 'http://192.168.0.178:3333',
});

export default api;
