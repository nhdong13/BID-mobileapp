import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import apiUrl from 'utils/Connection';

export async function getInvitations(userId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'GET',
    url: `${apiUrl.getInvitations}${userId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  // console.log(response.data);
  return response;
}
