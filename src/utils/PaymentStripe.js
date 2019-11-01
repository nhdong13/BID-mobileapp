/* eslint-disable react/no-string-refs */
import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MuliText } from 'components/StyledText';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { CreditCardInput } from 'react-native-credit-card-input';
import { FontAwesome5 } from '@expo/vector-icons';
import AlertPro from 'react-native-alert-pro';
import Toast, { DURATION } from 'react-native-easy-toast';
import { getUser } from 'api/user.api';
import * as LocalAuthentication from 'expo-local-authentication';
import { createCustomer, createCharge } from 'api/payment.api';

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
      name: null,
      email: null,
      userId: null,
      options: {
        promptMessage: 'Finger Print Scanner',
      },
    };
  }

  componentDidMount() {
    getUser().then((res) => {
      if (res.data) {
        const { nickname: name, email, id: userId } = res.data;
        this.setState({ name, email, userId });
      }
    });
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
      message: 'put your finger on the sensor to lose $10, yeeeh yeeh',
    });
    this.AlertPro.open();
    const result = await LocalAuthentication.authenticateAsync(
      this.state.options,
    );
    if (result.success) {
      // eslint-disable-next-line react/no-string-refs
      const { userId } = this.state;
      const charge = await createCharge(100000, userId);
      console.log('PHUC: PaymentStripe -> startScanning -> charge', charge);
      this.refs.toast.show(
        'Payment successful, you have lost $10',
        DURATION.LENGTH_LONG,
      );
      this.AlertPro.close();
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

  createStripeCustomer = async () => {
    if (this.state.formData != null) {
      const params = {
        // mandatory fields
        number: this.state.formData.values.number,
        expMonth: 11,
        expYear: 20,
        cvc: this.state.formData.values.cvc,
        // optional fields
        currency: 'vnd',
      };
      console.log('PHUC: PaymentStripe -> openStripe -> params', params);

      const result = await Stripe.createTokenWithCardAsync(params).catch(
        (error) =>
          console.log(
            'PHUC: PaymentStripe -> createStripeCustomer -> error',
            error,
          ),
      );
      console.log(
        'PHUC: PaymentStripe -> createStripeCustomer -> result',
        result,
      );

      const {
        card: { cardId },
        tokenId: token,
      } = result;
      // console.log(
      //   'PHUC: PaymentStripe -> createStripeCustomer -> cardId',
      //   cardId,
      // );
      // console.log(
      //   'PHUC: PaymentStripe -> createStripeCustomer -> token',
      //   token,
      // );

      if (token) {
        console.log('PHUC: PaymentStripe -> openStripe -> token', token);
        const { email, userId, name } = this.state;
        console.log(
          'PHUC: PaymentStripe -> createStripeCustomer -> userId',
          userId,
        );
        console.log(
          'PHUC: PaymentStripe -> createStripeCustomer -> email',
          email,
        );
        if (email != null && userId != null && name != null) {
          const customer = await createCustomer(
            email,
            token,
            userId,
            name,
            cardId,
          );
          console.log(
            'PHUC: PaymentStripe -> createStripeCustomer -> customer',
            customer,
          );
        }
      }
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
              onPress={() => this.createStripeCustomer()}
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
