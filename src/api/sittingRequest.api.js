import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import apiUrl from 'utils/Connection';
import moment from 'moment';

export async function recommend(requestId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = apiUrl.getRecommend + requestId;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
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

  const response = await axios(options).catch((error) => console.log(error));
  if (response) {
    return response.data;
  }
  return { message: 'error trying to get data from response' };
}

export async function cancelRequest(request) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');
  const options = {
    method: 'PUT',
    url: `${apiUrl.cancelRequest}${request.id}`,
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
  console.log('PHUC: getRequests -> data chac t danh may qua', data);

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
    if (userId != 0) console.log('PHUC: getRequests -> error', userId);
  });
  // console.log('PHUC: getRequests -> response', response);

  if (response) {
    response.data.map(
      (item) =>
        (item.sittingDate = new moment(item.sittingDate).format('YYYY-MM-DD')),
    );
    const dataGroup = groupByDate(response.data, 'sittingDate');
    return dataGroup;
  }
  return { message: 'error trying to get data from response' };
}

const groupByDate = (data, property) =>
  // group ngay tat ca request theo ngay
  data.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) acc[key] = [];

    acc[key].push(obj);
    return acc;
  }, {});
