import { AsyncStorage } from 'react-native';

export const saveToken = async (token, userId, roleId) => {
    try {
        await AsyncStorage.multiSet([['@jwt_token', token], ['@userId', JSON.stringify(userId)], ['@roleId', JSON.stringify(roleId)]]);
    } catch (error) {
        console.log(error);
    }
}

export const retrieveToken = async () => {
    try {
        const token = await AsyncStorage.getItem('@jwt_token');
        const userId = await AsyncStorage.getItem('@userId');
        const roleId = await AsyncStorage.getItem('@roleId');
        return { token, userId, roleId };
    } catch (error) {
        console.log(error);
    }
}

export const destroyToken = async () => {
    try {
        await AsyncStorage.removeItem('@jwt_token');
        await AsyncStorage.removeItem('@userId');
        await AsyncStorage.removeItem('@roleId');
    } catch (error) {
        console.log(error);
    }
}