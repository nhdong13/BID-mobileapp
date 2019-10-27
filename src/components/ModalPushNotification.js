import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import colors from 'assets/Color';
import { MuliText } from 'components/StyledText';

export default class ModalPushNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      requestId: null,
    };
  }

  componentDidMount() {
    const { setVisible, notification } = this.props;
    console.log("test " + notification);
    if (setVisible == true) {
      // this.setState({ requestId: notification});
      this.toggleModal();
    }
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onButtonClick = (status) => {
    if (status && status == 'YES') {
      console.log('yes, lets redirect to the screen you want');
      this.props.navigation.navigate('RequestDetail', {
        requestId: this.state.requestId,
      });
      // this.toggleModal();
    } else {
      this.toggleModal();
      console.log('no, booo huuu huuuu, you are a jack ass');
    }
  };

  render() {
    console.log(this.state.isModalVisible);
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        hasBackdrop={true}
        backdropOpacity={0.9}
        onBackdropPress={() => this.toggleModal()}
        backdropColor="white"
        onBackButtonPress={() => this.toggleModal()}
      >
        <View
          style={{
            flex: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <MuliText style={{ color: '#707070', fontSize: 16 }}>
            Bạn có chắc chắn muốn tiếp tục không ?
          </MuliText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.onButtonClick('NO')}
            >
              <MuliText style={{ color: colors.canceled, fontSize: 15 }}>
                Từ chối
              </MuliText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => this.onButtonClick('YES')}
            >
              <MuliText style={{ color: colors.done, fontSize: 15 }}>
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
    width: 120,
    height: 55,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    width: 120,
    height: 55,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2ecc71',
    borderWidth: 2,
    backgroundColor: 'white',
  },
});
