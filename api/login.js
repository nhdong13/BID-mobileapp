import axios from 'axios';
import qs from 'qs';

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
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
    };

    let response = await axios(options)
    .then(res => {
        res.data
    });
    // console.log("response is here ------------", response)
    // let responseOK = response && response.status === 200 && response.statusText === 'OK';
    // if (responseOK) {
    //     let datathis = response.data;
    //     console.log("-------------------------");
    //     console.log("I think here is our token " + datathis);
    // }

}

