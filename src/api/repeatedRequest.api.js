import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl, { parentAPI } from 'utils/Connection';

export async function createRepeatedRequest(repeatedRequest) {
  const {
    startDate,
    startTime,
    endTime,
    sittingAddress,
    repeatedDays,
    createdUser,
    request,
  } = repeatedRequest;

  const data = {
    startDate,
    startTime,
    endTime,
    sittingAddress,
    repeatedDays,
    status: 'ACTIVE',
    createdUser,
    request,
  };
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'POST',
    url: `${apiUrl.baseUrl}repeatedRequests/createRepeatedRequest/`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(data),
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
