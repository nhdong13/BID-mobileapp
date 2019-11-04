import { HOST_ENDPOINT } from 'react-native-dotenv';


const url = `http://${HOST_ENDPOINT}:5000/api/v1`;
const apiUrl = {
  baseUrl: `${url}/`,
  getRequests: `${url}/sittingRequests/listParent`,
  getInvitations: `${url}/invitations/`,
  login: `${url}/auth/login`,
  getRecommend: `${url}/sittingRequests/recommend/`,
  acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
  updateRequestStatus: `${url}/sittingRequests/`,
  updateInvitation: `${url}/invitations/`,
  registerExpoToken: `${url}/trackings/`,
  socket: `${url}/socket`,
};

export const babysitterAPI = {
  getProfile: `${url}/babysitters/`,
  getProfileByRequest: `${url}/babysitters/readByRequest/`,
};

export const userAPI = {
  getUser: `${url}/users/`,
};

export const paymentAPI = {
  createCustomer: `${url}/payment/customer/`,
  getCustomer: `${url}/payment/customer/`,
  createCharge: `${url}/payment/charge/`,
};

export default apiUrl;
