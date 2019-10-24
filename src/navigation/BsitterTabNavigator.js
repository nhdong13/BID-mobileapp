import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import qrBsitter from 'screens/qrBsitter';
import InvitationDetail from 'screens/InvitationDetail';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      // eslint-disable-next-line no-unused-vars
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    InvitationDetail: InvitationDetail,
    QrSitter: qrBsitter,
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
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
