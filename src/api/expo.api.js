import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';

export async function registerExpoToken(request) {
  const data = {
    userAgent: request.userId,
    token: request.token,
  };

  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'POST',
    url: apiUrl.registerExpoToken,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(data),
  };

  const response = await axios(options).catch((error) => {
    if (error && error.message.includes('Token exist!!')) {
      console.log('PHUC: registerExpoToken -> error', error);
    }
  });
  // console.log('PHUC: registerExpoToken -> response', response);

  if (response) {
    return response;
  }

  return { message: 'error trying to get data from response' };
}
