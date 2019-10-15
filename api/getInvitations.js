import axios from 'axios';
import { retrieveToken } from "./handleToken";
import qs from "qs";
import moment from 'moment';

const url = 'http://192.168.43.185:3000/api/v1/invitations/';

export async function getInvitations(userId) {
    const { token } = await retrieveToken();
    let trimpedToken = '';
    if (token) trimpedToken = token.replace(/['"]+/g, '');
    const options = {
        method: 'GET',
        url: `${url}${userId}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${trimpedToken}`
        },
    };

    let response = await axios(options).catch(error => console.log(error));
    console.log(response.data);
    return response
}


