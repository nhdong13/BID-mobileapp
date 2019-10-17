<<<<<<< HEAD
const url = 'http://10.251.234.113:3000/api/v1';
=======
const url = 'http://192.168.1.4:3000/api/v1';
>>>>>>> 3735804adc38a94dd0d2082f32ff0505151e475d
const apiUrl = {
    baseUrl: `${url}/`,
    getRequests: `${url}/sittingRequests/listParent`,
    getInvitations: `${url}/invitations/`,
    login: `${url}/auth/login`,
    getRecommend: `${url}/sittingRequests/recommend/`,
    acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
}

export default apiUrl;

