import { HOST_ENDPOINT } from 'react-native-dotenv';

const url = `http://${HOST_ENDPOINT}:5000/api/v1`;
const apiUrl = {
  baseUrl: `${url}/`,
  login: `${url}/auth/login`,
  registerExpoToken: `${url}/trackings/`,
  socket: `${url}/socket`,
  getRequests: `${url}/sittingRequests/listParent`,
  getRecommend: `${url}/sittingRequests/recommend/`,
  acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
  getSitting: `${url}/sittingRequests/listByStatus`,
  updateRequestStatus: `${url}/sittingRequests/`,
  updateInvitation: `${url}/invitations/`,
  getInvitations: `${url}/invitations/`,
};

export const babysitterAPI = {
  getProfile: `${url}/babysitters/`,
  getProfileByRequest: `${url}/babysitters/readByRequest/`,
  updateProfile: `${url}/babysitters/`,
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
