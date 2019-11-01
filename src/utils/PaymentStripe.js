/* eslint-disable react/no-string-refs */
import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MuliText } from 'components/StyledText';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome5 } from '@expo/vector-icons';
import AlertPro from 'react-native-alert-pro';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as LocalAuthentication from 'expo-local-authentication';

const styles = StyleSheet.create({
  switch: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#F5F5F5',
    marginTop: 60,
  },
  label: {
    color: 'black',
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: 'black',
  },
});

export class PaymentStripe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      message: '',
      title: '',
      formData: null,
      options: {
        promptMessage: 'Finger Print Scanner',
      },
    };
  }

  componentDidMount() {
    Stripe.setOptionsAsync({
      publishableKey: 'pk_test_HkQGKLlxWS5HRfm9YhXEuXU100bBNr5ikU', // Your key
      androidPayMode: 'test',
    });
    this.checkDeviceForHardware();
  }

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      this.setState({ message: 'Your device does not supported finger scan' });
      this.AlertPro.open();
    }
  };

  startScanning = async () => {
    console.log('go to start scanning');
    this.setState({
      title: 'Finger scanning',
      message: 'put your finger on the sensor to start scanning',
    });
    this.AlertPro.open();
    const result = await LocalAuthentication.authenticateAsync(
      this.state.options,
    );
    if (result.success) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.toast.show(
        'Fingerprint scanned, authentication success',
        DURATION.LENGTH_LONG,
      );
      this.AlertPro.close();
    } else if (result.error) {
      this.refs.toast.show(
        'Please clear the sensor and try again',
        DURATION.LENGTH_LONG,
      );
      await LocalAuthentication.authenticateAsync(this.state.options);
    } else {
      this.refs.toast.show(
        'Scan failed, please clean the sensor and try again',
        DURATION.LENGTH_LONG,
      );
      this.AlertPro.close();
    }
  };

  checkForBiometrics = async () => {
    const records = await LocalAuthentication.isEnrolledAsync();
    if (!records) {
      this.setState({
        title: 'FingerPrint not found',
        message: 'Please try again or use password to proceed',
      });
      this.AlertPro.open();
    } else {
      this.startScanning();
    }
  };

  _onChange = (formData) => {
    if (formData.valid == true) {
      this.setState({ formData: formData });
    }
  };

  _onFocus = (field) => console.log('focusing', field);

  openStripe = async () => {
    if (this.state.formData != null) {
      const params = {
        // mandatory
        number: this.state.formData.values.number,
        expMonth: 11,
        expYear: 20,
        cvc: this.state.formData.values.cvc,
      };
      console.log('PHUC: PaymentStripe -> openStripe -> params', params);

      const token = await Stripe.createTokenWithCardAsync(params);
      console.log('PHUC: PaymentStripe -> openStripe -> token', token);
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <Toast ref="toast" position="top" />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onCancel={() => this.AlertPro.close()}
          title={this.state.title}
          message={this.state.message}
          showConfirm={false}
          closeOnPressMask={false}
          onClose={() => LocalAuthentication.cancelAuthenticate()}
          customStyles={{
            mask: {
              backgroundColor: 'transparent',
            },
            container: {
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
          }}
        />

        <View style={{ flex: 0.6 }}>
          <CreditCardInput
            requiresCVC
            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor="black"
            invalidColor="red"
            placeholderColor="darkgray"
            onFocus={this._onFocus}
            onChange={this._onChange}
          />
        </View>

        <View style={{ alignItems: 'center', flex: 0.4 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => this.openStripe()}
              style={{ marginHorizontal: 10 }}
            >
              <MuliText>
                tap here to trigger the payment{this.state.token}
              </MuliText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 20,
              // backgroundColor: 'green',
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => this.startScanning()}
              style={{ alignItems: 'center' }}
            >
              <FontAwesome5 name="fingerprint" size={30} color="black" />
              <MuliText>Tap here to Scan finger print</MuliText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default PaymentStripe;

PaymentStripe.navigationOptions = {
  title: 'Liên kết thẻ tín dụng',
};
