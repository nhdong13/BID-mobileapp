import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';

export async function createRepeatedRequest(repeatedRequest) {
  const {
    startDate,
    startTime,
    endTime,
    sittingAddress,
    repeatedDays,
    createdUser,
  } = repeatedRequest;

  const data = {
    startDate,
    startTime,
    endTime,
    sittingAddress,
    repeatedDays,
    status: 'ACTIVE',
    createdUser,
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

export async function listRepeatedRequest(userId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'GET',
    url: `${apiUrl.baseUrl}repeatedRequests/listRepeatedRequest/${userId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function getRepeatedRequest(requestId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'GET',
    url: `${apiUrl.baseUrl}repeatedRequests/getRepeatedRequest/${requestId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}
