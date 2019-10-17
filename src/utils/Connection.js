const url = 'http://10.251.234.113:3000/api/v1';
const apiUrl = {
    baseUrl: `${url}/`,
    getRequests: `${url}/sittingRequests/listParent`,
    getInvitations: `${url}/invitations/`,
    login: `${url}/auth/login`,
    getRecommend: `${url}/sittingRequests/recommend/`,
    acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
}

export default apiUrl;

