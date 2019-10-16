import axios from "axios";
import { retrieveToken } from "./handleToken";
import qs from "qs";
import moment from "moment";

const url = "http://192.168.1.2:3000/api/v1/sittingRequests/";

export async function recommend(requestId) {
  //   const data = {
  //     userId: userId
  //   };
  const { token } = await retrieveToken();
  let trimpedToken = "";
  if (token) trimpedToken = token.replace(/['"]+/g, "");
  const options = {
    method: "GET",
    url: url + `recommend/1`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${trimpedToken}`
    }
  };

  let response = await axios(options).catch(error => console.log(error));
  if (response) {
    return response.data;
  } else {
    return { message: "error trying to get data from response" };
  }
}
