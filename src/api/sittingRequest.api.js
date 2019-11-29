/* eslint-disable no-unused-vars */
import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl, { sittingRequestAPI } from 'utils/Connection';

export async function getRequestDetail(requestId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'GET',
    url: `${sittingRequestAPI.getRequestDetail}${requestId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => {
    if (requestId != 0) console.log('PHUC: getRequests -> error', error);
  });

  if (response.data) {
    return response.data;
  }
  return { message: 'ERROR IN getRequestDetail - sittingRequestAPI' };
}

export async function recommend(requestId, request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = apiUrl.getRecommend + requestId;

  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(request),
  };

  const response = await axios(options).catch((error) => console.log(error));
  if (response) {
    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

export async function acceptBabysitter(requestId, sitterId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = apiUrl.acceptBabysitter + requestId + '&' + sitterId;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options);

  return response;
}

export async function startSitting(requestId, sitterId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = `${sittingRequestAPI.startSittingRequest}${requestId}&${sitterId}`;
  console.log('Duong: startSitting -> url', url);
  const options = {
    method: 'GET',
    url: `${sittingRequestAPI.startSittingRequest}${requestId}&${sitterId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function doneSitting(requestId, sitterId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const url = `${sittingRequestAPI.doneSittingRequest}${requestId}&${sitterId}`;
  const options = {
    method: 'GET',
    url: `${sittingRequestAPI.doneSittingRequest}${requestId}&${sitterId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function cancelRequest(requestId, status, chargeId, amount) {
  const data = {
    requestId,
    status,
    chargeId,
    amount,
  };

  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'PUT',
    url: apiUrl.cancelSittingRequest,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => console.log(error.response));
  if (response) {
    return response;
  }

  return { message: 'Error in CancelRequest - SittingRequestAPI' };
}

export async function updateRequest(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const url = apiUrl.updateRequestStatus + request.id;
  const options = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(request),
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function updateRequestStatus(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'PUT',
    url: `${apiUrl.updateRequestStatus}${request.id}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(request),
  };

  const response = await axios(options).catch((error) => console.log(error));
  return response;
}

export async function getRequests(userId) {
  const data = {
    userId: userId,
  };

  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'POST',
    url: apiUrl.getRequests,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(data),
  };

  const response = await axios(options).catch((error) => {
    if (userId != 0) console.log('PHUC: getRequests -> error', error);
  });

  if (response.data) {
    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

export async function getSitting(body) {
  const { userId } = body;
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'POST',
    url: apiUrl.getSitting,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(body),
  };

  const response = await axios(options).catch((error) => {
    if (userId != 0) console.log('PHUC: getRequests -> error', error);
  });

  if (response.data) {
    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

export async function getOverlapSittingRequest(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'POST',
    url: `${sittingRequestAPI.getOverlapRequests}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify(request),
  };

  const response = await axios(options);
  return response;
}
