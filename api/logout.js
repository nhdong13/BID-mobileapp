import axios from 'axios';
import qs from 'qs';
import { destroyToken } from './handleToken';

export default async function logout() {
    try {
        await destroyToken();
        return ({message: 'success'});
    } catch (error) {
        return error;
    }

}

