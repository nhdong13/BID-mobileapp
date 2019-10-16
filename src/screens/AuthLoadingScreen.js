import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { retrieveToken } from 'utils/handleToken';
import { Platform } from '@unimodules/core';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        await retrieveToken().then(res => {
            const userToken = res;
            if (userToken.roleId == 2) {
                console.log("this suppose to go to Parent Navigator");
                this.props.navigation.navigate('ParentMain');
            } else if (userToken.roleId == 3) {
                console.log("this suppose to go to Bsitter Navigator");
                this.props.navigation.navigate('BsitterMain');
            } else {
                this.props.navigation.navigate('Auth');
            }

        });

    };

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});