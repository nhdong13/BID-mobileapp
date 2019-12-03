import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import qs from 'qs';
import { pricingAPI } from 'utils/Connection';

export async function getPricings() {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = pricingAPI.listPricings;

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
