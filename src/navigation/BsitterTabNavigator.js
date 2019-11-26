import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import qrBsitter from 'screens/qrBsitter';
import InvitationDetail from 'screens/InvitationDetail';
import SitterHomeScreen from 'screens/babysitter/SitterHomeScreen';
import PaymentStripe from 'utils/PaymentStripe';
import ProfileDetail from 'screens/ProfileDetail';
import CalendarScreen from 'screens/babysitter/CalendarScreen';
import SittingHistory from 'screens/setting/SittingHistory';
import SettingsScreen from '../screens/SitterSetting';
import TabBarIcon from '../components/TabBarIcon';

const config = Platform.select({
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: SitterHomeScreen,
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
    Profile: ProfileDetail,
    Payment: PaymentStripe,
    SittingHistory: SittingHistory,
    CalendarScreen: CalendarScreen,
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
