import { destroyToken } from 'utils/handleToken';

export default async function logout() {
  console.log('it go to logout');
  try {
    await destroyToken();
    return { message: 'success on logout' };
  } catch (error) {
    return error;
  }
}
