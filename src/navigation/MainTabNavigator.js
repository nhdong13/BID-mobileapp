import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from 'components/TabBarIcon';
import HomeScreen from 'screens/HomeScreen';
import SettingsScreen from 'screens/SettingsScreen';
import CreateRequestScreen from 'screens/parent/CreateRequestScreen';
import RequestDetail from 'screens/RequestDetail';
import InvitationDetail from 'screens/InvitationDetail';
import RecommendBabysitter from 'screens/Recommend/RecommendScreen';
import ProfileDetail from 'screens/ProfileDetail';

const config = Platform.select({
  default: {},
});

const CreateRequestStack = createStackNavigator(
  {
    CreateRequest: CreateRequestScreen,
    HomeScreen,
  },
  config,
);

CreateRequestStack.navigationOptions = {
  tabBarLabel: 'Tạo mới yêu cầu',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-add' : 'md-add'}
    />
  ),
};

CreateRequestStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    RequestDetail,
    Recommend: RecommendBabysitter,
    CreateRequest: CreateRequestScreen,
    InvitationDetail,
  },
  config,
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Trang chủ',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

HomeStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    Detail: ProfileDetail,
  },
  config,
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Tùy chỉnh',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-options' : 'md-options'}
    />
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
