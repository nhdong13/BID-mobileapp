import axios from 'axios';
import qs from 'qs';
import { saveToken, retrieveToken } from './handleToken';

const url = 'http://192.168.0.102:3000/api/v1/auth/login';

export async function login(phoneNumber, password) {
    const data = {
        phoneNumber: phoneNumber,
        password: password,
    }
    const options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(data)
    };

    let response = await axios(options)
        .then(res => {
            saveToken(res.data.token, res.data.userId, res.data.roleId);
            return res;
        });
    return response;
}

