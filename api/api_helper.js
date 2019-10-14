/**
 * Constant for api
 * @type {Object}
 */
export const apiConfig = {
  host: 'http://192.168.0.106:3000/api/v1/',
}

/**
* Constant for endPoint
* @type {Object}
*/
export const apiEndPoint = {
  account: 'Account',
}


/**
* Api helper
*/
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
      // const token = await AsyncStorage.getItem(setting.auth.access_token);
      // if (token) {
      //     console.log(Authorization: ${token});
      //     options.headers['Authorization'] = Bearer ${token};
      // }
      // return Promise
      return fetch(url, options).then(resp => {
          console.log({ resp });
          if (resp.status === 401) {
              // refresh token
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
