/* eslint-disable no-else-return */
import axios from 'axios';
import qs from 'qs';
import { saveToken } from 'utils/handleToken';
import apiUrl, { authenticationAPI } from 'utils/Connection';
import registerPushNotifications from 'utils/Notification';

export async function login(phoneNumber, password) {
  // De day cho nho, ko ai dc xoa
  console.log('------------------');
  console.log("Can't Login ? Did you change your fucking IP you FAT FUCK ?");
  console.log('PHUC: login -> apiUrl.baseUrl', apiUrl.baseUrl);
  console.log('------------------');
  const data = {
    phoneNumber: phoneNumber,
    password: password,
  };
  const options = {
    method: 'POST',
    url: authenticationAPI.login,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then(async (res) => {
      const { token, userId, roleId } = res.data;
      if (token && roleId == 2) {
        await saveToken(token, userId, roleId);
        const tokenExpo = await registerPushNotifications(res.data.userId)
          .then((response) => {
            if (response) {
              console.log('PHUC: login -> response', response);
            }
          })
          .catch((error) => console.log('loi token roi', error));
        return res;
      } else {
        return res;
      }
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

export async function checkOtp(phoneNumber, otp) {
  const data = {
    phoneNumber: phoneNumber,
    otp: otp,
  };
  const options = {
    method: 'POST',
    url: authenticationAPI.checkOtp,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then(async (res) => {
      const { token, userId, roleId } = res.data;
      if ((token, userId, roleId)) {
        await saveToken(token, userId, roleId, tokenExpo);
        const tokenExpo = await registerPushNotifications(res.data.userId)
          .then((result) => {
            console.log('PHUC: checkOtp -> result', result);
            if (result) {
              console.log('PHUC: checkOtp -> response', result);
            }
          })
          .catch((error) => console.log(error));
      }

      return res;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        return error.response;
      } else console.log('onLogin error' + error);
    });

  return response;
}
