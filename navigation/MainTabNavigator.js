import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ParentDetails from '../screens/ParentDetail';
import CreateRequestScreen from '../screens/parent/CreateRequestScreen';
import CreateRequest from "../screens/CreateRequestScreen";

const config = Platform.select({
  default: {},
});

const CreateRequestStack= createStackNavigator (
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
    CreateRequest: CreateRequest,
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

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

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
  LinksStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
