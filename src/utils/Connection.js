import { HOST_ENDPOINT, HOST_ENDPOINT_COMPANY } from 'react-native-dotenv';

const url = `http://${HOST_ENDPOINT}:5000/api/v1`;
// const url = `http://${HOST_ENDPOINT_COMPANY}:5000/api/v1`;

const apiUrl = {
  baseUrl: `${url}/`,
  registerExpoToken: `${url}/trackings/`,
  socket: `${url}/socket`,
  getRequests: `${url}/sittingRequests/listParent`,
  getRecommend: `${url}/sittingRequests/recommend/`,
  acceptBabysitter: `${url}/sittingRequests/acceptBabysitter/`,
  getSitting: `${url}/sittingRequests/listByStatus`,
  updateRequestStatus: `${url}/sittingRequests/`,
  updateInvitation: `${url}/invitations/`,
  getInvitations: `${url}/invitations/`,
  cancelSittingRequest: `${url}/sittingRequests/cancelSittingRequest`,
};

export const authenticationAPI = {
  login: `${url}/auth/login`,
  checkOtp: `${url}/auth/checkOtp`,
};

export const parentAPI = {
  findByCode: `${url}/parents/findByCode/`,
  createCode: `${url}/parents/createCode/`,
};

export const babysitterAPI = {
  getProfile: `${url}/babysitters/`,
  getProfileByRequest: `${url}/babysitters/readByRequest/`,
  updateProfile: `${url}/babysitters/`,
  getAllBabysitter: `${url}/babysitters/`,
  getAllBabysitterWithSchedule: `${url}/babysitters/getAllBabysitterWithSchedule/`,
  getRequestData: `${url}/babysitters/getRequestData/`,
};

export const circleAPI = {
  getCircle: `${url}/circles/`,
  addToCircle: `${url}/circles/`,
};
export const userAPI = {
  getUser: `${url}/users/`,
};

export const paymentAPI = {
  createCustomer: `${url}/payment/customer/`,
  getCustomer: `${url}/payment/customer/`,
  createCharge: `${url}/payment/charge/`,
};

export const transactionAPI = {
  getRequestTransaction: `${url}/transactions/`,
};

export const sittingRequestAPI = {
  startSittingRequest: `${url}/sittingRequests/startSittingRequest/`,
  doneSittingRequest: `${url}/sittingRequests/doneSittingRequest/`,
  getOverlapRequests: `${url}/sittingRequests/getOverlapRequests`,
  getRequestDetail: `${url}/sittingRequests/`,
};

export const pricingAPI = {
  listPricings: `${url}/pricings`,
};

export const holidayAPI = {
  listHolidays: `${url}/holidays`,
};

export const configAPI = {
  readFirst: `${url}/configuration`,
};

export const skillAPI = {
  getAll: `${url}/skills`,
};

export const certAPI = {
  getAll: `${url}/certs`,
};

export default apiUrl;
