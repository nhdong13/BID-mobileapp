import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';

export default class qrBsitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrtext: 'dummies text here to take place',
    };
  }

  componentDidMount() {
    this.setState({ qrtext: this.props.navigation.getParam('qrData') }, () => {
      console.log(
        'PHUC: qrBsitter -> constructor -> qrtext',
        this.state.qrtext,
      );
    });

    const socketIO = io(apiUrl.socket, {
      transports: ['websocket'],
    });

    socketIO.on('connect', () => {
      socketIO.emit('userId', this.state.userId);
    });

    socketIO.on('scanned', () => {
      this.props.navigation.navigate('Home');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCode
          value={this.state.qrtext}
          size={250}
          bgColor="black"
          fgColor="white"
        />
      </View>
    );
  }
}

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
