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

  const response = await axios(options)
    .then((res) => {
      // console.log('PHUC: registerExpoToken -> res', res);
      return res;
    })
    .catch((error) => {
      console.log('PHUC: registerExpoToken -> error', error.response);

      return error.response;
    });
  // console.log('PHUC: registerExpoToken -> response', response);
  return response;
}
