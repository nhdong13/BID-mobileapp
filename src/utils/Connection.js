const url = 'http://192.168.0.118:3000/api/v1';
const apiUrl = {
    baseUrl: `${url}/`,
    getRequests: `${url}/sittingRequests/listParent`,
    getInvitations: `${url}/invitations/`,
    login: `${url}/auth/login`,
    getRecommend: `${url}/sittingRequests/recommend/`,
    acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
    cancelRequest: `${url}/sittingRequests/`,
    updateInvitation: `${url}/invitations/`,
    registerExpoToken: ''
}

export default apiUrl;

