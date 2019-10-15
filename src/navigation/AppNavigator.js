import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthTabNavigator from './AuthTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthTabNavigator,
      Main: MainTabNavigator
    }, {
    initialRouteName: 'AuthLoading',
  })
);
