import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { retrieveToken, destroyToken } from 'utils/handleToken';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    // await destroyToken();
    await retrieveToken().then((res) => {
      const userToken = res;
      // console.log(
      //   'PHUC: AuthLoadingScreen -> _bootstrapAsync -> userToken',
      //   userToken,
      // );

      if (
        // userToken.violated != 'true' &&
        // userToken.tokenExpo &&
        userToken.token
      ) {
        if (userToken.roleId == 2) {
          this.props.navigation.navigate('ParentMain');
        } else if (userToken.roleId == 3) {
          this.props.navigation.navigate('BsitterMain');
        } else {
          this.props.navigation.navigate('Auth');
        }
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
