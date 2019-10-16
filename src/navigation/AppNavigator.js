import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthTabNavigator from './AuthTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ParentTabNavigator from 'navigation/ParentTabNavigator';
import BsitterTabNavigator from 'navigation/BsitterTabNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthTabNavigator,
      Main: MainTabNavigator,
      ParentMain: ParentTabNavigator,
      BsitterMain: BsitterTabNavigator,
    }, {
    initialRouteName: 'AuthLoading',
  })
);
