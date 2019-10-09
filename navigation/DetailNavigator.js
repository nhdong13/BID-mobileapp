import React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator } from 'react-navigation';

import ParentDetails from '../screens/ParentDetail';



const config = Platform.select({
    default: {},
});

const Details = createStackNavigator(
    {
        Detail: ParentDetails,
    },
    config
);

export default Details;