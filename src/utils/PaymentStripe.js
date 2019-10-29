import * as React from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import { MuliText } from 'components/StyledText';
import { PaymentsStripe } from 'expo-payments-stripe';

export class PaymentStripe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  componentWillMount() {
    console.log('Test if it go in here');
    PaymentsStripe.setOptionsAsync({
      publishableKey: 'pk_test_HkQGKLlxWS5HRfm9YhXEuXU100bBNr5ikU', // Your key
      androidPayMode: 'test',
    });
  }

  openStripe = async () => {
    const options = {
      requiredBillingAddressFields: 'full',
      prefilledInformation: {
        billingAddress: {
          name: 'Gunilla Haugeh',
          line1: 'Canary Place',
          line2: '3',
          city: 'Macon',
          state: 'Georgia',
          country: 'US',
          postalCode: '31217',
        },
      },
    };

    const token = await PaymentsStripe.paymentRequestWithCardFormAsync(
      options,
    ).catch((error) => {
      console.log('PHUC: PaymentStripe -> componentWillMount -> error', error);
    });

    this.setState(token);
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => this.openStripe()}>
          <MuliText>tap here to trigger the payment{this.state.token}</MuliText>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PaymentStripe;
