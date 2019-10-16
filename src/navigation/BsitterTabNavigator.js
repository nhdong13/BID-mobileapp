import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InvitationDetail from 'screens/InvitationDetail';
import RequestDetail from 'screens/RequestDetail';
import RequestList from 'screens/babysitter/RequestListScreen';

const config = Platform.select({
    default: {},
});

// Babysitter Incoming sitting
const ISStack = createStackNavigator(
    {
        RequestList: RequestList,
        RequestDetail: RequestDetail
    },
    config
);

ISStack.navigationOptions = {
    tabBarLabel: 'Incomming Sitting',
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

ISStack.path = '';

///
const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
        InvitationDetail: InvitationDetail
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
    ISStack,
    SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
