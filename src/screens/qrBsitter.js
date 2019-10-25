import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode';

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
