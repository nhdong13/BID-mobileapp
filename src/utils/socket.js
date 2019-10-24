// eslint-disable-next-line no-unused-vars
import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';

// Replace this URL with your own, if you want to run the backend locally!

export default class Socket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line prefer-const
    let socket = io(apiUrl.socketIo, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('does it go here');
      this.setState({ isConnected: true });
    });
    socket.on('connect_error', (error) => {
      console.log('connection error  ', error);
    });

    socket.on('error', (error) => {
      console.log('jsut some normal error, error in general ', error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>connected: {this.state.isConnected ? 'true' : 'false'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
