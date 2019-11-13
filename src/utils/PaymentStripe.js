/* eslint-disable react/no-string-refs */
import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MuliText } from 'components/StyledText';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { CreditCardInput, CardView } from 'react-native-credit-card-input';
import AlertPro from 'react-native-alert-pro';
// eslint-disable-next-line no-unused-vars
import Toast, { DURATION } from 'react-native-easy-toast';
import { getUser } from 'api/user.api';
import * as LocalAuthentication from 'expo-local-authentication';
import { createCustomer, getCustomer } from 'api/payment.api';
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
      textCancel: 'No',
    };
  }

  componentDidMount() {
    getUser().then((res) => {
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
      // console.log('PHUC: PaymentStripe -> openStripe -> params', params);
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

          if (customer.code) {
            // console.log(
            //   'PHUC: PaymentStripe -> createStripeCustomer -> customer',
            //   customer,
            // );
            this.setState({
              title: customer.code,
              message: customer.message,
              textCancel: 'Try Again',
            });
            this.AlertPro.open();
          } else {
            this.setState({
              title: 'Add Success',
              message: 'your card have been added',
              textCancel: 'Ok',
            });
            this.AlertPro.open();
          }
        }
      }
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  getStripeCustomer = async () => {
    const { userId } = this.state;
    if (userId != null) {
      const { data: customer } = await getCustomer(userId).catch((error) => {
        console.log('PHUC: getStripeCustomer -> error', error);
        this.setState({ loading: false });
      });
      if (customer) {
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
    this.setState({ loading: false });
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
          textCancel={this.state.textCancel}
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
      </View>
    );
  }
}

export default PaymentStripe;

PaymentStripe.navigationOptions = {
  title: 'Liên kết thẻ tín dụng',
};
