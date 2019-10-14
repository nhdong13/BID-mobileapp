import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateRequestScreen from '../screens/parent/CreateRequestScreen';
<<<<<<< HEAD
import RecommendBabysitter from '../screens/RecommendScreen';
import InvitationDetails from '../screens/InvitationDetail';
=======
import CreateRequest from '../screens/parent/CreateRequestScreen';
import RequestDetail from '../screens/InvitationDetail';
import RecommeandBabysitter from '../screens/RecommendScreen';
>>>>>>> 7c51ee38a59c4df457ad471e8b12d8528b6f5550

const config = Platform.select({
  default: {},
});

const CreateRequestStack = createStackNavigator(
  {
    CreateRequest: CreateRequestScreen,
    HomeScreen: HomeScreen,
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
    RequestDetail: ParentDetails,
    CreateRequest: CreateRequestScreen,
    Recommend: RecommendBabysitter,
    InvitationDetail: InvitationDetails
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
