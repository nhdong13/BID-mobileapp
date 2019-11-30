import { AsyncStorage } from 'react-native';

export const saveToken = async (token, userId, roleId) => {
  try {
    await AsyncStorage.multiSet([
      ['@jwt_token', token],
      ['@userId', JSON.stringify(userId)],
      ['@roleId', JSON.stringify(roleId)],
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const saveTokenExpo = async (tokenExpo) => {
  console.log('PHUC: saveTokenExpo -> tokenExpo', tokenExpo);
  try {
    await AsyncStorage.multiSet([['@token_expo', tokenExpo]]);
  } catch (error) {
    console.log(error);
  }
};

export const saveViolation = async (violated) => {
  console.log('PHUC: saveViolation -> violated', JSON.stringify(violated));
  try {
    await AsyncStorage.multiSet([['@violated', JSON.stringify(violated)]]);
  } catch (error) {
    console.log(error);
  }
};

export const destroyViolated = async () => {
  await AsyncStorage.removeItem('@violated');
};

export const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@jwt_token');
    const userId = await AsyncStorage.getItem('@userId');
    const roleId = await AsyncStorage.getItem('@roleId');
    const tokenExpo = await AsyncStorage.getItem('@token_expo');
    const violated = await AsyncStorage.getItem('@violated');

    return { token, userId, roleId, tokenExpo, violated };
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const retrieveTokenExpo = async () => {
  try {
    const tokenExpo = await AsyncStorage.getItem('@token_expo');
    console.log('PHUC: retrieveTokenExpo -> tokenExpo', tokenExpo);

    return { tokenExpo };
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const destroyToken = async () => {
  try {
    await AsyncStorage.removeItem('@jwt_token');
    await AsyncStorage.removeItem('@userId');
    await AsyncStorage.removeItem('@roleId');
  } catch (error) {
    console.log(error);
  }
};
