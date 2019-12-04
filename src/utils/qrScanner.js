import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ToastAndroid,
  Platform,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import {
  NavigationActions,
  StackActions,
  withNavigationFocus,
} from 'react-navigation';
import { startSitting, doneSitting } from 'api/sittingRequest.api';

import io from 'socket.io-client';

import { BarCodeScanner } from 'expo-barcode-scanner';
import apiUrl from './Connection';

export class QRcodeScannerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      content: '',
      userId: 0 || this.props.navigation.getParam('userId'),
      isDone: false || this.props.navigation.getParam('isDone'),
      qr: 'babysitter in demand is the best capstone project ',
      message: 'Request to scan QR',
      dataInvitation: null || this.props.navigation.getParam('data'),
    };
  }

  async componentDidMount() {
    this.triggerQr();
    this.getPermissionsAsync();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        this.triggerQr();
      }
    }
  }

  triggerQr = () => {
    const socket = io(apiUrl.socket, {
      transports: ['websocket'],
    });
    // just hard code the passpharse for now, we will use a code generator later
    const { qr, message, userId } = this.state;
    socket.emit('scanQr', {
      qr: qr + userId,
      message: message,
      userId: userId,
    });

    socket.on('connect_error', (error) => {
      console.log('QR connection error  ', error);
    });

    socket.on('error', (error) => {
      console.log('QR just some normal error, error in general ', error);
    });
  };

  onSuccess = () => {
    const socket = io(apiUrl.socket, {
      transports: ['websocket'],
    });
    // just hard code the passpharse for now, we will use a code generator later
    const { qr, message, userId } = this.state;

    socket.emit('success', {
      qr: qr,
      message: message,
      userId: userId,
    });

    socket.on('connect_error', (error) => {
      console.log('QR connection error  ', error);
    });

    socket.on('error', (error) => {
      console.log('QR just some normal error, error in general ', error);
    });
  };

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  handleBarCodeScanned = ({ data }) => {
    if (`${this.state.qr}${this.state.userId}` == data) {
      this.setState(
        {
          scanned: true,
          content: `QRcode with data ${data}`,
        },
        () => {
          if (this.state.scanned == true) {
            if (Platform.OS != 'ios') {
              ToastAndroid.showWithGravity(
                'QR scanned success',
                ToastAndroid.LONG,
                ToastAndroid.TOP,
                25,
                80,
              );
              this.onSuccess();
              const { dataInvitation } = this.state;
              if (dataInvitation != null) {
                console.log(
                  'Duong: QRcodeScannerScreen -> handleBarCodeScanned -> dataInvitation.status',
                  dataInvitation.status,
                );
                if (dataInvitation.status == 'ONGOING') {
                  startSitting(dataInvitation.id, this.state.userId)
                    .then(() => {
                      // this.props.navigation.navigate('Home', { loading: false });
                    })
                    .catch((error) => console.log(error));
                }
                if (dataInvitation.status == 'DONE') {
                  doneSitting(dataInvitation.id, this.state.userId)
                    .then(() => {
                      // this.props.navigation.navigate('Home', { loading: false });
                    })
                    .catch((error) => console.log(error));
                }
              }
            }
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });

            const { isDone, dataInvitation } = this.state;
            if (isDone) {
              this.props.navigation.dispatch(resetAction);
              this.props.navigation.navigate('Feedback', {
                requestId: dataInvitation.id,
              });
            } else {
              this.props.navigation.navigate('Home');
            }
          }
        },
      );
    }

    console.log(`Bar code with data ${data} has been scanned!`);
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
            <Text sytle={{ color: 'white' }}>{this.state.content}</Text>
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

export default withNavigationFocus(QRcodeScannerScreen);
