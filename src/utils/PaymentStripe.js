/* eslint-disable react/no-string-refs */
import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MuliText } from 'components/StyledText';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { CreditCardInput, CardView } from 'react-native-credit-card-input';
import { FontAwesome5 } from '@expo/vector-icons';
import AlertPro from 'react-native-alert-pro';
import Toast, { DURATION } from 'react-native-easy-toast';
import { getUser } from 'api/user.api';
import * as LocalAuthentication from 'expo-local-authentication';
import { createCustomer, createCharge, getCustomer } from 'api/payment.api';
import { STRIPE_PUBLISHABLE_KEY as stripeKey } from 'react-native-dotenv';
import Loader from 'utils/Loader';

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
      message: '',
      title: '',
      formData: null,
      name: null,
      email: null,
      userId: null,
      cardId: null,
      brand: null,
      last4: null,
      expMonth: null,
      expYear: null,
      loading: false,
      options: {
        promptMessage: 'Finger Print Scanner',
      },
    };
  }

  componentDidMount() {
    getUser().then((res) => {
      this.setState({ loading: true });
      if (res.data) {
        const { nickname: name, email, id: userId } = res.data;
        this.setState({ name, email, userId }, () => {
          this.getStripeCustomer().catch((error) => {
            console.log(
              'PHUC: PaymentStripe -> componentDidMount -> error',
              error,
            );
            this.setState({ loading: false });
          });
        });
      }
    });
    Stripe.setOptionsAsync({
      publishableKey: stripeKey,
      androidPayMode: 'test',
    });
  }

  checkDeviceForHardware = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      this.setState({ message: 'Your device does not supported finger scan' });
      this.AlertPro.open();
    } else {
      this.startScanning();
    }
  };

  startScanning = async () => {
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
      const {
        values: { number, cvc, expiry },
      } = this.state.formData;

      const params = {
        // mandatory fields
        number: number,
        expMonth: parseInt(expiry.split('/')[0], 10),
        expYear: parseInt(expiry.split('/')[1], 10),
        cvc: cvc,
        // optional fields
        currency: 'vnd',
      };
      console.log('PHUC: PaymentStripe -> openStripe -> params', params);
      this.setState({ loading: true });
      const result = await Stripe.createTokenWithCardAsync(params).catch(
        (error) =>
          console.log(
            'PHUC: PaymentStripe -> createStripeCustomer -> error',
            error,
          ),
      );

      const {
        card: { cardId },
        tokenId: token,
      } = result;

      if (token && cardId) {
        // console.log(
        //   'PHUC: PaymentStripe -> createStripeCustomer -> cardId',
        //   cardId,
        // );
        // console.log('PHUC: PaymentStripe -> openStripe -> token', token);
        const { email, userId, name } = this.state;
        if (email != null && userId != null && name != null) {
          const customer = await createCustomer(
            email,
            token,
            userId,
            name,
            cardId,
          );

          if (customer) {
            console.log(
              'PHUC: PaymentStripe -> createStripeCustomer -> customer',
              customer,
            );
          }
        }
      }
      this.setState({ loading: false });
    }
  };

  getStripeCustomer = async () => {
    const { userId } = this.state;
    if (userId != null) {
      this.setState({ loading: true });
      const { data: customer } = await getCustomer(userId).catch((error) =>
        console.log('PHUC: getStripeCustomer -> error', error),
      );
      if (customer) {
        console.log('PHUC: getStripeCustomer -> customer', customer);
        const {
          id: cardId,
          brand,
          last4,
          exp_year: expYear,
          exp_month: expMonth,
        } = customer;
        this.setState({
          cardId,
          brand,
          last4,
          expYear,
          expMonth,
          loading: false,
        });
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
        <Loader loading={this.state.loading} />
        <View style={{ flex: 0.6 }}>
          {this.state.cardId != null ? (
            <View>
              <MuliText>Thẻ tín dụng của bạn</MuliText>
              <CardView
                number={`**** **** **** ${this.state.last4}`}
                brand={this.state.brand}
                name="."
                expiry={`${this.state.expMonth}/${this.state.expYear}`}
              />
            </View>
          ) : (
            <View>
              <MuliText style={{ marginHorizontal: 10 }}>
                Liên kết thẻ tín dụng để thực hiện thanh toán
              </MuliText>
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
              <View
                style={{
                  marginTop: 20,
                  height: 150,
                  marginHorizontal: 30,
                  alignItems: 'center',
                  backgroundColor: 'red',
                }}
              >
                <TouchableOpacity
                  onPress={() => this.createStripeCustomer()}
                  style={{ marginHorizontal: 10 }}
                >
                  <MuliText style={{ color: 'white' }}>Lưu thẻ</MuliText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ alignItems: 'center', flex: 0.4 }}>
          <View
            style={{
              marginTop: 20,
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => this.checkDeviceForHardware()}
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
