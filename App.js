import { AppLoading } from 'expo';
import { retrieveToken } from 'utils/handleToken';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, YellowBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';
import NavigationService from './NavigationService.js';

import AppNavigator from './src/navigation/AppNavigator';

export default function App(props) {
  console.ignoredYellowBox = ['Remote debugger'];

  YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  ]);
  console.log('local ra cai coi ' + NavigationService);
  useEffect(() => {
    retrieveToken().then((res) => {
      const { roleId } = res;

      if (roleId == 3) {
        console.log('useEffect react hook');
        const bsitterSocket = io(apiUrl.socketIo, {
          transports: ['websocket'],
        });

        bsitterSocket.on('connect', () => {
          console.log('main app socket to recceiver');
        });

        bsitterSocket.on('qrTrigger', (qr) => {
          if (qr != null) {
            const { data } = qr.qr;
            console.log('PHUC: App -> qr', data);
            NavigationService.navigate('QrSitter', { qrData: data });
          }
        });

        bsitterSocket.on('connect_error', (error) => {
          console.log('connection error  ', error);
        });

        bsitterSocket.on('error', (error) => {
          console.log('jsut some normal error, error in general ', error);
        });
      }
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
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      muli: require('./assets/fonts/Muli-Regular.ttf'),
      muliBold: require('./assets/fonts/Muli-Bold.ttf'),
      muliSemiBold: require('./assets/fonts/Muli-SemiBold.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
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
