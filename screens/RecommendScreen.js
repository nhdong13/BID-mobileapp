import React, { Component } from 'react';
import { Header } from 'react-navigation';
import { login } from '../api/login';
import { destroyToken } from '../api/handleToken';
import Modal from 'react-native-modal';
import {
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
    KeyboardAvoidingView,
} from 'react-native';

import { MuliText } from '../components/StyledText';

export default class RecommendScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{}}>
                    <MuliText style={{}}>Recommend Babysitter </MuliText>
                    <TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

RecommendScreen.navigationOptions = {
    title: 'Recommend babysitter'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textInput: {
        borderColor: '#EEEEEE',
        width: 300,
        height: 60,
        borderWidth: 2,
        borderRadius: 30,
        padding: 10,
        fontFamily: 'muli',
    },
    recommendContainer: {
        alignItems: 'center',
        marginTop: 30,
        paddingTop: 20,
        marginBottom: 20,
        flex: 0.4,
    },
    submitButton: {
        width: 300,
        height: 60,
        padding: 10,
        backgroundColor: '#315F61',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    buttonContainer: {
        paddingTop: 30,
        alignItems: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 10,
    },

});
