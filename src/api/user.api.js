import axios from 'axios';
import qs from 'qs';
import { userAPI } from 'utils/Connection';
import { retrieveToken } from 'utils/handleToken';

export async function getUser() {
  const { userId } = await retrieveToken();
  console.log('PHUC: getUser -> userId', userId);

  const options = {
    method: 'GET',
    url: `${userAPI.getUser}${userId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(userId),
  };

  const response = await axios(options)
    .then(async (res) => res)
    .catch((error) => {
      if (error.response) {
        console.log('Error in user.api.js -> getUser');
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else console.log('onLogin error' + error);
    });

  if (response.data) {
    return response.data;
  }
  return { message: 'Error in userApi' };
}
