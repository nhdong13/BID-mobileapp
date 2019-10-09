import axios from 'axios';
import qs from 'qs';

const url = 'http://192.168.0.102:3000/api/v1/users/';

export async function getAllUsers(token) {
    const data = {
        token: token
    }
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    let response = await axios(options)
        .then(res => {
            res.send({ res })
        });

}

