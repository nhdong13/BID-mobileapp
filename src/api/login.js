import axios from 'axios';
import qs from 'qs';
import { saveToken } from 'utils/handleToken';
import apiUrl from 'utils/Connection';

export async function login(phoneNumber, password) {
    const data = {
        phoneNumber: phoneNumber,
        password: password,
    }
    const options = {
        method: 'POST',
        url: apiUrl.login,
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

