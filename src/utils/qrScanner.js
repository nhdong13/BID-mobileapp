import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import io from 'socket.io-client';

import { BarCodeScanner } from 'expo-barcode-scanner';
import apiUrl from './Connection';

export default class QRcodeScannerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      content: '',
    };
  }

  async componentDidMount() {
    const socket = io(apiUrl.socketIo, {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      console.log('qrScanner -> does it go here');
      socket.emit('qrscanning', { data: '12341234' });
    });

    socket.on('connect_error', (error) => {
      console.log('connection error  ', error);
    });

    socket.on('error', (error) => {
      console.log('jsut some normal error, error in general ', error);
    });

    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({
      scanned: true,
      content: `Bar code with type ${type} and data ${data} has been scanned!`,
    });
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`,
    );
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <View>
            <Text>{this.state.content}</Text>
            <Button
              title="Tap to Scan Again"
              onPress={() => this.setState({ scanned: false })}
            />
          </View>
        )}
      </View>
    );
  }
}
