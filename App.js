/* eslint-disable no-self-assign */
import { AppLoading } from 'expo';
import { retrieveToken } from 'utils/handleToken';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import registerPushNotifications from 'utils/Notification';
import { Platform, StatusBar, StyleSheet, View, YellowBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';
import NavigationService from './NavigationService.js';

import AppNavigator from './src/navigation/AppNavigator';

export default function App(props) {
  console.ignoredYellowBox = ['Remote debugger'];

  YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, ' +
      '`cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  ]);
  useEffect(() => {
    retrieveToken().then((res) => {
      const { userId, roleId } = res;

      registerPushNotifications(userId).then((response) => {
        if (response) {
          console.log('PHUC: App -> response', response.data);
        }
      });

      const socketIO = io(apiUrl.socket, {
        transports: ['websocket'],
      });

      socketIO.on('connect', () => {
        socketIO.emit('userId', userId);
      });

      socketIO.on('triggerQr', (data) => {
        if (roleId == 3) {
          NavigationService.navigate('QrSitter', { qrData: data.qr });
        }
      });

      // socketIO.on('connect_error', (error) => {
      //   console.log('Bsitter connection error  ', error);
      // });

      // socketIO.on('error', (error) => {
      //   console.log('Bsitter error in general ', error);
      // });
    });
  }, []);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }
  return (
    <View style={styles.container}>
      {Platform.OS == 'ios' && <StatusBar barStyle="default" />}
      <AppNavigator
        ref={(navigatoRef) => {
          NavigationService.setTopLevelNavigator(navigatoRef);
        }}
      />
    </View>
  );
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      muli: require('./assets/fonts/Muli-Regular.ttf'),
      muliBold: require('./assets/fonts/Muli-Bold.ttf'),
      muliSemiBold: require('./assets/fonts/Muli-SemiBold.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
