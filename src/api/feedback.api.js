import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';

export async function getAllFeedbackByUserId(userId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'GET',
    url: `${apiUrl.baseUrl}feedback/getAllFeedbackByUserId/${userId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options)
    .then((res) => {
      // console.log('PHUC: registerExpoToken -> res', res);
      return res;
    })
    .catch((error) => {
      console.log('PHUC: getAllFeedbackByUserId -> error', error);

      return error.response;
    });
  return response;
}
