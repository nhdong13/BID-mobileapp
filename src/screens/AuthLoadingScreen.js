import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { retrieveToken } from 'utils/handleToken';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        retrieveToken().then(res => {
            const userToken = res;
            this.props.navigation.navigate(userToken.token && userToken.token != '' ? 'Main' : 'Auth');
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