import React, { Component } from 'react';
import { login } from 'api/login';
import Modal from 'react-native-modal';
import {
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from 'assets/Color';
import * as LocalAuthentication from 'expo-local-authentication';
import AlertPro from 'react-native-alert-pro';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '02',
      password: '12341234',
      OTP: '',
      isModalVisible: false,
      roleId: null,
      userId: null,
      options: {
        promptMessage: 'Finger Print Scanner',
      },
      message: '',
      title: '',
      textCancel: 'Close',
    };
  }

  onLogin = async () => {
    const { phoneNumber, password } = this.state;
    login(phoneNumber, password)
      .then((res) => {
        if (res && res != 400) {
          if (res.data.roleId && res.data.roleId == 3) {
            this.setState({ roleId: res.data.roleId, userId: res.data.userId });
            this.setState({ isModalVisible: true });
          } else {
            this.setState({ roleId: res.data.roleId, userId: res.data.userId });
            this.props.navigation.navigate('AuthLoading', {
              roleId: this.state.roleId,
              userId: this.state.userId,
            });
          }
        } else if (Platform.OS != 'ios') {
          ToastAndroid.showWithGravity(
            'Wrong Username or Password',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            80,
          );
        }
      })
      .catch((error) => {
        console.log('Error on LoginScreen ' + error);
      });
  };

  onSubmitOTP = async () => {
    // eslint-disable-next-line no-unused-expressions
    this.state.OTP.length == 7
      ? this.props.navigation.navigate('AuthLoading', {
          roleId: this.state.roleId,
          userId: this.state.userId,
        })
      : console.log('wrong OTP code, please try again');
  };

  toggleModal = () => {
    if (this.state.roleId && this.state.roleId == 3) {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    } else {
      this.setState({ isModalVisible: false });
    }
  };

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      this.setState({
        title: 'Hardware not found',
        message: 'Your device does not supported finger scan',
        textCancel: 'Close',
      });
      this.AlertPro.open();
    } else {
      this.startScanning();
    }
  };

  startScanning = async () => {
    this.setState({
      title: 'Quét vân tay',
      message: 'Chạm tay vào cảm biến để thực hiện đăng nhập',
      textCancel: 'Quay lại',
    });
    this.AlertPro.open();
    const result = await LocalAuthentication.authenticateAsync(
      this.state.options,
    );
    if (result.success) {
      // eslint-disable-next-line react/no-string-refs
      this.props.navigation.navigate('AuthLoading', {
        roleId: this.state.roleId,
        userId: this.state.userId,
      });

      this.AlertPro.close();
    } else {
      this.AlertPro.close();
    }
  };

  checkForBiometrics = async () => {
    const records = await LocalAuthentication.isEnrolledAsync();
    if (!records) {
      this.setState({
        title: 'FingerPrint not found',
        message: 'Please try again or use password to proceed',
        textCancel: 'Try Again',
      });
      this.AlertPro.open();
    } else {
      this.startScanning();
    }
  };

  render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center' }}
          keyboardVerticalOffset={60}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <AlertPro
            ref={(ref) => {
              this.AlertPro = ref;
            }}
            onCancel={() => this.AlertPro.close()}
            title={this.state.title}
            message={this.state.message}
            showConfirm={false}
            closeOnPressMask={false}
            onClose={() => LocalAuthentication.cancelAuthenticate()}
            textCancel={this.state.textCancel}
            customStyles={{
              mask: {
                backgroundColor: 'transparent',
              },
              container: {
                shadowColor: '#000000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
              },
            }}
          />
          <View style={styles.welcomeContainer}>
            <Image
              source={require('assets/images/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('assets/images/login-family.png')}
              style={styles.familyImage}
            />
            <MuliText style={{ color: colors.loginText, fontSize: 16 }}>
              Xin hãy đăng nhập để tiếp tục
            </MuliText>
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({ phoneNumber: text })}
              placeholder="Username"
              disableFullscreenUI={false}
              value={this.state.phoneNumber}
              textContentType="username"
            />
          </View>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({ password: text })}
              placeholder="Password"
              disableFullscreenUI={false}
              value={this.state.password}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.onLogin}
            >
              <MuliText style={{ color: 'white', fontSize: 16 }}>
                Đăng nhập
              </MuliText>
            </TouchableOpacity>
          </View>

          {this.state.isModalVisible ? (
            <Modal
              isVisible={this.state.isModalVisible}
              hasBackdrop={true}
              backdropOpacity={0.9}
              onBackdropPress={this.toggleModal}
              backdropColor="white"
              onBackButtonPress={this.toggleModal}
            >
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
                <MuliText style={{ color: colors.loginText, fontSize: 16 }}>
                  Xin nhập Authentication Code
                </MuliText>
                <View style={styles.textContainer}>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({ OTP: text })}
                    placeholder="Authentication code"
                    disableFullscreenUI={false}
                    value={this.state.OTP}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.submitOTPButton}
                    onPress={this.onSubmitOTP}
                  >
                    <MuliText style={{ color: 'white', fontSize: 16 }}>
                      Gửi
                    </MuliText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.checkDeviceForHardware()}
                    style={{ alignItems: 'center' }}
                  >
                    <FontAwesome5
                      name="fingerprint"
                      size={30}
                      color={colors.darkGreenTitle}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            <View />
          )}

          <View style={styles.welcomeContainer}>
            <MuliText>Bản quyền thuộc về nhóm đồ án BID</MuliText>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
    backgroundColor: colors.white,
  },
  textInput: {
    borderColor: colors.white,
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: 'muli',
  },
  submitButton: {
    width: 250,
    height: 60,
    padding: 10,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitOTPButton: {
    width: 250,
    height: 60,
    padding: 10,
    marginRight: 10,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
});
