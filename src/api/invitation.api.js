import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import apiUrl from 'utils/Connection';
import qs from 'qs';

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

  return response;
}

export async function createInvitation(requestId, invitation, request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = apiUrl.getInvitations + requestId;

  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify({ newInvite: JSON.stringify(invitation), newRequest: JSON.stringify(request) }),
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function listByRequestAndStatus(requestId, status) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url =
    apiUrl.getInvitations +
    'listByRequestAndStatus/' +
    requestId +
    '&' +
    status;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response.data;
}

export async function updateInvitation(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'PUT',
    url: `${apiUrl.updateInvitation}${request.id}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(request),
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}
