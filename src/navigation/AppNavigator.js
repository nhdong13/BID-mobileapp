import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthTabNavigator from './AuthTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import ParentTabNavigator from 'navigation/ParentTabNavigator';
import BsitterTabNavigator from 'navigation/BsitterTabNavigator';
import RecommendScreen from 'screens/RecommendScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthTabNavigator,
      Main: MainTabNavigator,
      Recommend: RecommendScreen,
      ParentMain: ParentTabNavigator,
      BsitterMain: BsitterTabNavigator,
    }, {
    initialRouteName: 'AuthLoading',
  })
);
