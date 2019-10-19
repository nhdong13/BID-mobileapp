import axios from 'axios';
import qs from 'qs';
import { saveToken } from 'utils/handleToken';
import apiUrl from 'utils/Connection';

export async function login(phoneNumber, password) {
  // De day cho nho, ko ai dc xoa
  console.log('------------------');
  console.log("Can't Login ??? Did you change your fucking IP you FAT FUCK ?");
  console.log(` @${apiUrl.baseUrl} `);
  console.log('------------------');
  const data = {
    phoneNumber: phoneNumber,
    password: password,
  };
  const options = {
    method: 'POST',
    url: apiUrl.login,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => {
      saveToken(res.data.token, res.data.userId, res.data.roleId);
      return res;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else console.log('onLogin error' + error);
    });
  return response;
}
