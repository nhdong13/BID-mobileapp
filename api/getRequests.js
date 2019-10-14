import axios from 'axios';
import { retrieveToken } from "./handleToken";
import qs from "qs";

const url = 'http://192.168.0.102:3000/api/v1/sittingRequests/listParent';

export async function getRequests(userId) {
    const data = {
        userId: userId
    };
    const token = await retrieveToken();
    const options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        },
        data: qs.stringify(data)
    };

    let response = await axios(options).catch(error => console.log(error));
    const dataGroup = groupByDate(response.data, 'sittingDate');
    return dataGroup;
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

