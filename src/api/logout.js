import { destroyToken } from 'utils/handleToken';
// import io from 'socket.io-client';

export default async function logout() {
  console.log('it go to logout');
  try {
    await destroyToken();
    return { message: 'success on logout' };
  } catch (error) {
    return error;
  }
}
