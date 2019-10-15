import { retrieveToken } from '../api/handleToken';

//refactor one day 
export const apiConfig = {
  host: 'http://192.168.43.185:3000/api/v1/',
}

export const apiEndPoint = {
    account: 'Account',
}

class Api {
    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // request
            'dataType': 'application/json', // response
        }
    }

    static get(route) {
        return this.xhr(route, null, 'GET');
    }

    static put(route, params) {
        return this.xhr(route, params, 'PUT')
    }

    static post(route, params) {
        return this.xhr(route, params, 'POST')
    }

    static delete(route, params) {
        return this.xhr(route, params, 'DELETE')
    }

    static async xhr(route, params, verb) {
        const url = apiConfig.host + route
        let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
        options.headers = Api.headers();
        console.log({ request: params, headers: options.headers });
        const { token } = await retrieveToken();
        const trimpedToken = token.replace(/['"]+/g, '');
        console.log(trimpedToken)
        if (token) {
            options.headers['Authorization'] = `Bearer ${trimpedToken}`;
        }
        // return Promise
        return fetch(url, options).then(resp => {
            console.log({ resp });
            if (resp.status === 401) {
                // refresh token
                console.log('Unauthorized');
            }
            let json = resp.json();
            if (resp.ok) {
                return json
            }
            return json.then(err => { throw err });
        });
    }
}
export default Api;
