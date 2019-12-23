/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { login, checkOtp } from 'api/login';
import Toast, { DURATION } from 'react-native-easy-toast';
import { retrieveToken } from 'utils/handleToken';

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
  Clipboard,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from 'assets/Color';
import * as LocalAuthentication from 'expo-local-authentication';
import AlertPro from 'react-native-alert-pro';
import { changePassword } from 'api/user.api';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '0965474202',
      password: '12341234',
      newPassword: '',
      OTP: null,
      isModalVisible: false,
      roleId: null,
      userId: null,
      options: {
        promptMessage: 'Finger Print Scanner',
      },
      message: '',
      title: '',
      textCancel: 'Close',
      secret: null,
      firstTime: false,
      textConfirm: 'Tiếp tục',
      showConfirm: false,
      violated: 'false',
      isChangePassword: false,
    };
    console.log(
      'PHUC: LoginScreen -> constructor -> violated',
      this.state.violated,
    );
  }

  async componentDidMount() {
    const { violated } = await retrieveToken();
    if (violated == 'true') {
      this.setState({
        violated,
        title: 'Đăng nhập bằng thiết bị khác với thiết bị đã đăng ký',
        message:
          'Bạn không thể đăng nhập bằng thiết bị khác với đăng ký, nếu đây là thiết bị đã đăng ký xin vui lòng liên hệ cho ban quản trị để  biết thông tin chi tiết',
        textCancel: 'Ẩn',
      });

      this.AlertPro.open();
    }
  }

  onLogin = async () => {
    const { phoneNumber, password } = this.state;
    await login(phoneNumber, password)
      .then((res) => {
        if (res && res != 400) {
          const { roleId, userId } = res.data;
          if (res.data.roleId && res.data.roleId == 3) {
            const { secret, firstTime } = res.data;
            if (firstTime) {
              this.setState({
                roleId,
                userId,
                secret: secret.base32,
                firstTime,
                isModalVisible: false,
                isChangePassword: true,
              });
            } else {
              this.setState({
                roleId,
                userId,
                firstTime,
                isModalVisible: true,
                isChangePassword: false,
              });
            }
          } else {
            this.setState({ roleId, userId });
            this.props.navigation.navigate('AuthLoading', {
              roleId: this.state.roleId,
              userId: this.state.userId,
            });
          }
        } else {
          this.refs.toast.show('Sai thông tin đăng nhập hoặc mật khẩu');
        }
      })
      .catch((error) => {
        console.log('Error on LoginScreen ' + error);
      });
  };

  onSubmitOTP = async () => {
    const { phoneNumber, OTP } = this.state;
    await checkOtp(phoneNumber, OTP).then(async (result) => {
      console.log('PHUC: LoginScreen -> onSubmitOTP -> result', result.status);
      if (result.status !== 401) {
        const { roleId, userId } = this.state;
        // await saveViolation(false);
        this.props.navigation.navigate('AuthLoading', {
          roleId: roleId,
          userId: userId,
        });
      } else {
        this.refs.toast.show(
          'Mã otp sai hoặc đã bị vô hiệu hóa, vui lòng liên hệ với tổng đài để kích hoạt lại',
        );
      }
    });
  };

  onChangePassword = async () => {
    // thuc hien thay doi mat khau
    if (this.state.newPassword != '') {
      this.setState({
        title: 'Thay đổi mật khẩu cho lần đăng nhập đầu',
        message: 'Bạn có chắc chắn muốn đổi mật khẩu này ?',
        textCancel: 'Quay lại',
        textConfirm: 'Tiếp tục',
        showConfirm: true,
      });
      this.AlertPro.open();
    }
  };

  submitChangePassword = async () => {
    const { password, newPassword, phoneNumber } = this.state;
    const data = {
      phoneNumber,
      password,
      newPassword,
    };

    await changePassword(data).then((result) => {
      if (result.status === 200) {
        // doi pass thanh cong, mo modal lay otp
        this.setState({ isChangePassword: false, isModalVisible: true });
      }
    });
  };

  onCopy = async () => {
    const { secret } = this.state;
    Clipboard.setString(secret);
    await Clipboard.getString();
    this.refs.toast.show('Lưu mã code thành công');
  };

  onFinish = async () => {
    this.setState({
      title: 'Hoàn tất việc lưu mã vào ứng dụng lấy otp',
      message:
        'Bạn có chắc đã lưu mã, sau khi hoàn thành bạn sẽ không thể lấy lại được mã code ?',
      textCancel: 'Quay lại',
      textConfirm: 'Tiếp tục',
      showConfirm: true,
    });
    this.AlertPro.open();
  };

  onConfirmFinish = async () => {
    const { roleId, userId } = this.state;

    this.props.navigation.navigate('AuthLoading', {
      roleId: roleId,
      userId: userId,
    });
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
        showConfirm: false,
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
      showConfirm: false,
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
    const {
      secret,
      firstTime,
      isModalVisible,
      isChangePassword,
      title,
      message,
      showConfirm,
      textCancel,
      textConfirm,
    } = this.state;

    return (
      <ScrollView>
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onCancel={() => this.AlertPro.close()}
          onConfirm={() =>
            this.state.isChangePassword
              ? this.submitChangePassword()
              : this.onConfirmFinish()
          }
          title={title}
          message={message}
          showConfirm={showConfirm}
          closeOnPressMask={false}
          onClose={() => LocalAuthentication.cancelAuthenticate()}
          textCancel={textCancel}
          textConfirm={textConfirm}
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
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center' }}
          keyboardVerticalOffset={60}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <Toast ref="toast" position="top" />

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
              onPress={() => this.onLogin()}
            >
              <MuliText style={{ color: 'white', fontSize: 16 }}>
                Đăng nhập
              </MuliText>
            </TouchableOpacity>
          </View>

          {isModalVisible ? (
            <Modal
              isVisible={this.state.isModalVisible}
              hasBackdrop={true}
              backdropOpacity={0.9}
              backdropColor="white"
              onBackButtonPress={() => this.toggleModal()}
            >
              <Toast ref="toast" position="top" />
              <AlertPro
                ref={(ref) => {
                  this.AlertPro = ref;
                }}
                onCancel={() => this.AlertPro.close()}
                onConfirm={() =>
                  this.state.isChangePassword
                    ? this.submitChangePassword()
                    : this.onConfirmFinish()
                }
                title={title}
                message={message}
                showConfirm={showConfirm}
                closeOnPressMask={false}
                onClose={() => LocalAuthentication.cancelAuthenticate()}
                textCancel={textCancel}
                textConfirm={textConfirm}
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

              {secret && firstTime ? (
                <View
                  style={{
                    flex: 0.3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  <MuliText style={{ color: colors.loginText, fontSize: 16 }}>
                    Vui lòng đăng ký otp bằng ứng dụng Authenticator hoặc Authy,
                    mã code này sẽ không được hiển thị lại, nếu mất mã code xin
                    vui lòng liên hệ lại với ban quản trị
                  </MuliText>
                  <View style={styles.textContainer}>
                    <MuliText>{secret}</MuliText>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => this.onCopy()}
                      style={{ marginTop: 20 }}
                    >
                      <View style={styles.submitOTPButton}>
                        <MuliText style={{ color: 'white', fontSize: 16 }}>
                          Sao chép
                        </MuliText>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.onFinish()}
                    style={{
                      marginTop: 30,
                      alignItems: 'center',
                    }}
                  >
                    <View style={styles.finishButton}>
                      <MuliText style={{ color: 'white', fontSize: 16 }}>
                        Hoàn tất
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
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
                    <TouchableOpacity onPress={() => this.onSubmitOTP()}>
                      <View style={styles.submitButton}>
                        <MuliText style={{ color: 'white', fontSize: 16 }}>
                          Gửi
                        </MuliText>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.checkDeviceForHardware()}
                      style={{ alignItems: 'center' }}
                    >
                      <FontAwesome5
                        name="fingerprint"
                        size={30}
                        color={colors.darkGreenTitle}
                        style={{ marginLeft: 5 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Modal>
          ) : (
            <View style={{ flex: 1 }}>
              {isChangePassword ? (
                <Modal
                  isVisible={this.state.isChangePassword}
                  hasBackdrop={true}
                  backdropOpacity={0.9}
                  backdropColor="white"
                >
                  <Toast ref="toast" position="top" />

                  {firstTime ? (
                    <View
                      style={{
                        flex: 0.7,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        paddingHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      <View
                        style={{
                          marginHorizontal: 20,
                          alignItems: 'center',
                        }}
                      >
                        <MuliText
                          style={{ color: colors.loginText, fontSize: 14 }}
                        >
                          Vui lòng thay đổi mật khấu cho lần đăng nhập đầu tiên
                        </MuliText>
                      </View>

                      <View>
                        <View style={styles.textContainer}>
                          <MuliText>Mật khẩu cũ</MuliText>
                        </View>

                        <View style={styles.textContainer}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) =>
                              this.setState({ password: text })
                            }
                            placeholder="Mật khẩu cũ"
                            disableFullscreenUI={false}
                            value={this.state.password}
                            keyboardType="number-pad"
                            secureTextEntry={true}
                          />
                        </View>
                      </View>
                      <View>
                        <View style={styles.textContainer}>
                          <MuliText>Mật khẩu mới</MuliText>
                        </View>

                        <View style={styles.textContainer}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) =>
                              this.setState({ newPassword: text })
                            }
                            placeholder="Mật khẩu mới"
                            disableFullscreenUI={false}
                            value={this.state.newPassword}
                            keyboardType="number-pad"
                            secureTextEntry={true}
                          />
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => this.onChangePassword()}
                          style={{ marginTop: 30 }}
                        >
                          <View style={styles.submitOTPButton}>
                            <MuliText style={{ color: 'white', fontSize: 16 }}>
                              Thay đổi
                            </MuliText>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </Modal>
              ) : null}
            </View>
          )}

          <View style={styles.welcomeContainer}>
            <MuliText style={{ color: colors.loginText, fontSize: 10 }}>
              Bản quyền thuộc về nhóm đồ án BID, đại học FPT
            </MuliText>
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
    borderColor: colors.gray,
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
  finishButton: {
    width: 200,
    height: 50,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
