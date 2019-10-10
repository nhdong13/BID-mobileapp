import React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import CreateRequestScreen from '../screens/CreateRequestScreen';

const config = Platform.select({
    default: {},
});

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
    },
    config
);

export default AuthStack;