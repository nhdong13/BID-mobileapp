import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import { babysitterAPI } from 'utils/Connection';
import moment from 'moment';

export async function getProfile(sitterId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = babysitterAPI.getProfile + sitterId;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  if (response) {
    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

