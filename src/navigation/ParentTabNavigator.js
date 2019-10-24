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
import RecommendBabysitter from 'screens/Recommend/RecommendScreen';
import BsitterProfile from 'screens/Recommend/BsitterProfile';
import ProfileDetail from 'screens/ProfileDetail';
import MyNetwork from 'screens/circle/MyNetwork';
import QRcodeScannerScreen from 'utils/qrScanner';

const config = Platform.select({
  default: {},
});

// const CreateRequestStack = createStackNavigator(
//   {
//     CreateRequest: CreateRequestScreen,
//   },
//   config,
// );

// CreateRequestStack.navigationOptions = {
//   tabBarLabel: 'Tạo mới yêu cầu',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS == 'ios' ? 'ios-add' : 'md-add'}
//     />
//   ),
// };

// CreateRequestStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      // eslint-disable-next-line no-unused-vars
      navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    },
    RequestDetail: RequestDetail,
    CreateRequest: {
      screen: CreateRequestScreen,
      navigationOptions: () => ({
        title: 'A',
        headerBackTitle: 'RecommendBabysitter',
      }),
    },
    Recommend: {
      screen: RecommendBabysitter,
      navigationOptions: () => ({
        title: 'Người giữ trẻ phù hợp',
      }),
    },
    SitterProfile: {
      screen: BsitterProfile,
      navigationOptions: () => ({
        title: 'Thông tin người giữ trẻ',
      }),
    },
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

const CircleStack = createStackNavigator(
  {
    QrScanner: QRcodeScannerScreen,
    Circles: MyNetwork,
  },
  config,
);

CircleStack.navigationOptions = {
  tabBarLabel: 'Vòng tròn tin tưởng',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS == 'ios' ? 'ios-man' : 'md-man'}
    />
  ),
};

CircleStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    Profile: ProfileDetail,
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
  CircleStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
