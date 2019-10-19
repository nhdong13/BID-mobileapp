import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import moment from 'moment';
import apiUrl from 'utils/Connection';

export async function getRequests(userId) {
  const data = {
    userId: userId,
  };
  // console.log('PHUC: getRequests -> data', data);

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

  const response = await axios(options).catch((error) =>
    console.log('PHUC: getRequests -> error', error),
  );
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
