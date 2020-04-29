import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';
import { withNavigation } from 'react-navigation';

class qrBsitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrtext:
        'dummies text here to take place' ||
        this.props.navigation.getParam('qrData'),
      userId: null || this.props.navigation.getParam('userId'),
    };
  }

  componentDidMount() {
    const { qrData, userId } = this.props.navigation.state.params;
    if (qrData && userId) {
      console.log('PHUC: qrBsitter -> componentDidMount -> userId', userId);
      console.log('PHUC: qrBsitter -> componentDidMount -> qrData', qrData);
      this.setState({ qrtext: qrData, userId: userId }, () => {
        console.log(
          'PHUC: qrBsitter -> constructor -> qrtext',
          this.state.qrtext,
        );
      });

      const successSocket = io(apiUrl.socket, {
        transports: ['websocket'],
      });

      successSocket.on('connect', () => {
        successSocket.emit('userId', this.state.userId);
        console.log('PHUC: qrBsitter -> userId', this.state.userId);
      });

      successSocket.on('scanned', () => {
        console.log('it come to socket');
        this.props.navigation.navigate('Home');
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCode
          value={this.state.qrtext}
          size={250}
          backgroundColor="white"
          color="black"
        />
      </View>
    );
  }
}

export default withNavigation(qrBsitter);

qrBsitter.navigationOptions = {
  title: 'quét qr',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 5,
  },
});
