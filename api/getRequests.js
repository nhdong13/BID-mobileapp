import axios from 'axios';
import { retrieveToken } from "./handleToken";
import qs from "qs";

const url = 'http://192.168.0.102:3000/api/v1/parents/getRequest';

export async function getRequests(id) {
    const data = id;
    const token = await retrieveToken();
    console.log(data);
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data)
    };

    let response = await axios(options);
    console.log(response);
    return response;
}

