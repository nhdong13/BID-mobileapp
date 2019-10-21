const url = 'http://10.249.206.113:3000/api/v1';
const apiUrl = {
  baseUrl: `${url}/`,
  getRequests: `${url}/sittingRequests/listParent`,
  getInvitations: `${url}/invitations/`,
  login: `${url}/auth/login`,
  getRecommend: `${url}/sittingRequests/recommend/`,
  acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
  cancelRequest: `${url}/sittingRequests/`,
  updateInvitation: `${url}/invitations/`,
  registerExpoToken: `${url}/trackings/`,
};

export default apiUrl;
