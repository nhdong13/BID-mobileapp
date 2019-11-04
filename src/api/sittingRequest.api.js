import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';

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

export async function updateRequest(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const url = apiUrl.updateRequestStatus + request.id;
  console.log(url);
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
  // console.log('PHUC: getRequests -> data chac t danh may qua', data);

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
  // // console.log('PHUC: getRequests -> response', response);

  if (response.data) {
    // console.log('PHUC: getRequests -> response', response.data);
    // response.data.map(
    //   (item) =>
    //     (item.sittingDate = new moment(item.sittingDate).format('YYYY-MM-DD')),
    // );
    // const dataGroup = groupByDate(response.data, 'sittingDate');
    // return dataGroup;

    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

export async function getSitting(body) {
  const userId = body.userId;
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
// eslint-disable-next-line no-unused-vars
const groupByDate = (data, property) =>
  // group ngay tat ca request theo ngay
  data.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) acc[key] = [];

    acc[key].push(obj);
    return acc;
  }, {});
