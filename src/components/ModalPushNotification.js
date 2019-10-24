import React, { Component } from 'react';
import { View, Modal, StyleSheet } from 'react-native';

import { MuliText } from 'components/StyledText';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ModalPushNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
            Do you want to proceed ?
          </MuliText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.onButtonClick('DENIED')}
            >
              <MuliText style={{ color: 'red', fontSize: 15 }}>
                Từ chối
              </MuliText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => this.onButtonClick('ACCEPTED')}
            >
              <MuliText style={{ color: '#2ecc71', fontSize: 15 }}>
                Chấp nhận
              </MuliText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginHorizontal: 35,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  submitButton: {
    width: 90,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    width: 100,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2ecc71',
    borderWidth: 2,
    backgroundColor: 'white',
  },
});
