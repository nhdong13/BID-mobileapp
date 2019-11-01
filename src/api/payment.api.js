import axios from 'axios';
import qs from 'qs';
import apiUrl from 'utils/Connection';

export async function createCustomer(email, token, id, name) {
  const data = {
    email,
    token,
    id,
    name,
  };
  const options = {
    method: 'PUT',
    url: apiUrl.createCustomer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else console.log('Create Customer error' + error);
    });
  return response;
}

export async function getCustomer(id) {
  const options = {
    method: 'POST',
    url: apiUrl.getCustomer,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(id),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else console.log('Create Customer error' + error);
    });
  return response;
}

export async function createCharge(amount, id) {
  const data = {
    amount,
    id,
  };
  const options = {
    method: 'POST',
    url: apiUrl.createCharge,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else console.log('Create Customer error' + error);
    });
  return response;
}
