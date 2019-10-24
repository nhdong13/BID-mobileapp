import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode';

export default class qrBsitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrtext: '12341234',
    };
  }

  componentDidMount() {
    this.setState({ qrtext: this.props.navigation.getParam('qrData') });
    console.log('PHUC: qrBsitter -> constructor -> qrtext', this.state.qrtext);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
        }}
      >
        <QRCode
          value="con me may cai qr code chet tiet"
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
