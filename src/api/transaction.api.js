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
        if (error.response.status == 404) {
          console.log(
            `Warning in Transaction api because no transaction were made`,
          );
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(`Error happend in Transaction api`);
          console.log(error.response);
        }
      } else console.log('getRequestTransaction error' + error);
    });
  if (response.data) {
    console.log('PHUC: getRequestTransaction -> response', response.data);
    return response.data;
  }
  return { message: 'Error in TransactionAPI -> getRequestTransaction' };
}
