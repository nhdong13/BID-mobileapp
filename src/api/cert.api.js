import axios from 'axios';
import qs from 'qs';
import apiUrl, { certAPI } from 'utils/Connection';

export async function getCerts() {
  const options = {
    method: 'GET',
    url: certAPI.getAll,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await axios(options).catch((error) => {
    console.log('error in getCerts - cert.api.js: ', error);
  });

  return response;
}
