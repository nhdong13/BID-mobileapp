import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import { parentAPI } from 'utils/Connection';

export async function findByCode(userId, code) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = parentAPI.findByCode + userId + '&' + code;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options);

  return response;
}

export async function createCode(userId, code) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = parentAPI.createCode;
  const options = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify({ userId: userId, code: code }),
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}
