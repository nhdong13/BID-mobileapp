const url = 'http://172.17.230.129:3000/api/v1';
const apiUrl = {
    baseUrl: `${url}/`,
    getRequests: `${url}/sittingRequests/listParent`,
    getInvitations: `${url}/invitations/`,
    login: `${url}/auth/login`,
}

export default apiUrl;

