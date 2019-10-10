import { AsyncStorage } from 'react-native';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('@jwt_token', token);
    } catch (error) {
        console.log(error);
    }
}

export const retrieveToken = async () => {
    try {
        const token = await AsyncStorage.getItem('@jwt_token');
        return token;
    } catch (error) {
        console.log(error);
    }
}

export const destroyToken = async () => {
    try {
        await AsyncStorage.removeItem('@jwt_token');
    } catch (error) {
        console.log(error);
    }
}