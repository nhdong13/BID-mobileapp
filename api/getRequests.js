import axios from 'axios';
import { retrieveToken } from "./handleToken";
import qs from "qs";
import moment from 'moment';

const url = 'http://192.168.43.185:3000/api/v1/sittingRequests/listParent';

export async function getRequests(userId) {
    const data = {
        userId: userId
    };
    const { token } = await retrieveToken();
    let trimpedToken = '';
    if (token) trimpedToken = token.replace(/['"]+/g, '');
    const options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${trimpedToken}`
        },
        data: qs.stringify(data)
    };

    let response = await axios(options).catch(error => console.log(error));
    if (response) {
        response.data.map(item => item.sittingDate = new moment(item.sittingDate).format('YYYY-MM-DD'));
        const dataGroup = groupByDate(response.data, 'sittingDate');
        return dataGroup;
    } else return ({ message: 'error trying to get data from response' })
}

const groupByDate = (data, property) => {
    // group request theo ngay
    return data.reduce((acc, obj) => {
        let key = obj[property];
        if (!acc[key]) acc[key] = [];

        acc[key].push(obj);
        return acc;
    }, {});
}

