import React, { Component } from 'react';
import { Header } from 'react-navigation';
import { login } from 'api/login';
import { destroyToken } from 'api/handleToken';
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

import { MuliText } from 'components/StyledText';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '0326261307',
      password: '12341234',
      title: 'lallalala',
      OTP: '',
      isModalVisible: false,
      roleId: null,
    };

  }

  onLogin = async () => {
    const { phoneNumber, password } = this.state;
    login(phoneNumber, password)
      .then((res) => {
        console.log(res.data)
        if (res.data.roleId && res.data.roleId == 3) {
          this.setState({ roleId: res.data.roleId, userId: res.data.userId });
          this.setState({ isModalVisible: true })
        } else {
          this.setState({ roleId: res.data.roleId, userId: res.data.userId });
          this.props.navigation.navigate('Main', { roleId: this.state.roleId, userId: this.state.userId });
        }
      }).catch(error => console.log('onLogin error' + error));
  }

  onSubmitOTP = async () => {
    this.state.OTP.length === 7 ? this.props.navigation.navigate('Main', { roleId: this.state.roleId, userId: this.state.userId }) : console.log('wrong OTP code, please try again');
  }

  toggleModal = () => {
    if (this.state.roleId && this.state.roleId == 3) {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    } else {
      this.setState({ isModalVisible: false });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        keyboardVerticalOffset={60}
        behavior={Platform.OS === "ios" ? 'padding' : 'height'}
      >
        <View style={styles.welcomeContainer}>
          <Image
            source={
              require('assets/images/logo.png')
            }
            style={styles.logoImage}
          />
        </View>
        <View style={styles.welcomeContainer}>
          <Image source={
            require('assets/images/login-family.png')
          }
            style={styles.familyImage}
          />
          <MuliText style={{ color: '#707070', fontSize: 16 }}>Please login to continue</MuliText>
        </View>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ phoneNumber: text })}
            placeholder='Username'
            disableFullscreenUI={false}
            value={this.state.phoneNumber}
            textContentType='username'
          />
        </View>
        <View style={styles.textContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ password: text })}
            placeholder='Password'
            disableFullscreenUI={false}
            value={this.state.password}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={this.onLogin}>
            <MuliText style={{ color: 'white', fontSize: 16 }}>Login</MuliText>
          </TouchableOpacity>
        </View>
        {this.state.isModalVisible ?
          (
            <Modal
              isVisible={this.state.isModalVisible}
              hasBackdrop={true} backdropOpacity={0.9}
              onBackdropPress={this.toggleModal}
              backdropColor='white'
              onBackButtonPress={this.toggleModal}
            >
              <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <MuliText style={{ color: '#707070', fontSize: 16 }}>Please input your Authentication Code</MuliText>
                <View style={styles.textContainer}>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={text => this.setState({ OTP: text })}
                    placeholder='Authentication code'
                    disableFullscreenUI={false}
                    value={this.state.OTP}
                    keyboardType='number-pad'
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.submitButton} onPress={this.onSubmitOTP}>
                    <MuliText style={{ color: 'white', fontSize: 16 }}>Submit</MuliText>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )
          :
          (
            <View></View>
          )
        }

        <View style={styles.welcomeContainer}>
          <MuliText>copyrights claim thing that you don't want to read</MuliText>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;

LoginScreen.navigationOptions = {
  header: null,
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
  logoImage: {
    width: 80,
    height: 36,
    resizeMode: 'contain',
    marginTop: 40,
    marginLeft: -10,
  },
  familyImage: {
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },
  tabBarInfoContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 5,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});