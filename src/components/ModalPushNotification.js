import React, { Component } from 'react';
import { View, Modal, TextInput, StyleSheet, Platform } from 'react-native';

import { MuliText } from 'components/StyledText';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ModalPushNotification extends Component {
  render() {
    return (
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
          <MuliText style={{ color: '#707070', fontSize: 16 }}>
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
              style={styles.submitButton}
              onPress={this.onSubmitOTP}
            >
              <MuliText style={{ color: 'white', fontSize: 16 }}>Gửi</MuliText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
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
