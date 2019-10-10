import axios from 'axios';
import { retrieveToken } from './handleToken';

const url = 'http://192.168.43.185:5000/api/v1/users/';

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

