import axios from 'axios';
import { retrieveToken } from './handleToken';

const url = 'http://172.16.1.156:3000/api/v1/users/';

export async function getAllUsers(token) {
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    let response = await axios(options);
    return response;
}

