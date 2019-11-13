import axios from 'axios';
import { transactionAPI } from 'utils/Connection';

export async function getRequestTransaction(requestId) {
  const options = {
    method: 'GET',
    url: `${transactionAPI.getRequestTransaction}${requestId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await axios(options)
    .then((res) => res)
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else console.log('getRequestTransaction error' + error);
    });
  if (response.data) {
    console.log('PHUC: getRequestTransaction -> response', response.data);
    return response.data;
  }
  return { message: 'Error in TransactionAPI -> getRequestTransaction' };
}
