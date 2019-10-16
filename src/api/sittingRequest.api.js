import axios from "axios";
import { retrieveToken } from "utils/handleToken";
import qs from "qs";
import apiUrl from 'utils/Connection';

export async function recommend(requestId) {
  //   const data = {
  //     userId: userId
  //   };
  const { token } = await retrieveToken();
  let trimpedToken = "";
  if (token) trimpedToken = token.replace(/['"]+/g, "");

  let url = apiUrl.getRecommend + requestId;

  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${trimpedToken}`
    },
  };

  let response = await axios(options).catch(error => console.log(error));
  if (response) {
    return response.data;
  } else {
    return { message: "error trying to get data from response" };
  }
}

export async function acceptBabysitter(requestId, sitterId) {
  const { token } = await retrieveToken();
  let trimpedToken = "";
  if (token) trimpedToken = token.replace(/['"]+/g, "");

  let url = apiUrl.acceptBabysitter + requestId + '&' + sitterId;
  console.log(url);

  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${trimpedToken}`
    },
  };

  let response = await axios(options).catch(error => console.log(error));
  if (response) {
    return response.data;
  } else {
    return { message: "error trying to get data from response" };
  }
}