import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ParentDetails from '../screens/RequestDetail';
import CreateRequestScreen from '../screens/parent/CreateRequestScreen';
import RecommendBabysitter from '../screens/RecommendScreen';

const config = Platform.select({
  default: {},
});

const CreateRequestStack = createStackNavigator(
  {
    CreateRequest: CreateRequestScreen,
  },
  config
);

CreateRequestStack.navigationOptions = {
  tabBarLabel: 'New Sitting',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-add'
          : 'md-add'
      }
    />
  ),
};

CreateRequestStack.path = '';

const HomeStack = createStackNavigator(
  {

    Home: HomeScreen,
    Detail: ParentDetails,
    CreateRequest: CreateRequestScreen,
    Recommend: RecommendBabysitter
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-home'
          : 'md-home'
      }
    />
  ),
};

HomeStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CreateRequestStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
