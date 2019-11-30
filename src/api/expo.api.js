import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';
import NavigationService from '../../NavigationService';

export async function registerExpoToken(request) {
  const data = {
    userAgent: request.userId,
    token: request.token,
  };
  console.log('PHUC: registerExpoToken -> token', data.token);

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
      console.log('PHUC: registerExpoToken -> res', res);
      return res;
    })
    .catch((error) => {
      console.log('PHUC: registerExpoToken -> error', error.response);
      if (
        error.response.status === 400 &&
        error.response.data.message == 'Token exist!!'
      ) {
        NavigationService.navigate('Login', {
          title: 'Tạm dừng hoạt động của tài khoản',
          message:
            'Tài khoản của bạn vừa đăng nhập ở một thiết bị khác, điều này gây vi phạm tính bảo mật, tài khoản này sẽ bị dừng hoạt động cho tới khi chúng tôi kiểm tra một cách kỹ lưỡng',
          violated: true,
        });
      }
      return error.response;
    });
  // console.log('PHUC: registerExpoToken -> response', response);

  if (response) {
    return response;
  }

  return { message: 'error trying to get data from response' };
}
