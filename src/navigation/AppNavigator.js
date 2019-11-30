// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoginScreen from 'screens/LoginScreen';
import ParentTabNavigator from 'navigation/ParentTabNavigator';
import BsitterTabNavigator from 'navigation/BsitterTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthTabNavigator from './AuthTabNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthTabNavigator,
      Login: LoginScreen,
      ParentMain: ParentTabNavigator,
      BsitterMain: BsitterTabNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
