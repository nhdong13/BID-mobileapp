import { HOST_ENDPOINT } from 'react-native-dotenv';

console.log(HOST_ENDPOINT);
const url = `http://${HOST_ENDPOINT}:5000/api/v1`;
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

export const babysitterAPI = {
  getProfile: `${url}/babysitters/`,
  getProfileByRequest: `${url}/babysitters/readByRequest/`,
};

export default apiUrl;
