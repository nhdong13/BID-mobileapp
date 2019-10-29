import * as React from 'react';
import StripeCheckout from 'expo-stripe-checkout';

export class PaymentStripe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  onPaymentSuccess = (token) => {
    console.log('PHUC: PaymentStripe -> onPaymentSuccess -> token', token);

    this.setState({ token });
    console.log(this.state.token);
  };

  onClose = () => {
    // maybe navigate to other screen here?
  };

  render() {
    return (
      <StripeCheckout
        publicKey="pk_test_HkQGKLlxWS5HRfm9YhXEuXU100bBNr5ikU"
        amount={100000}
        storeName="Tra tien cho tao, reeeeeee"
        description="Test"
        currency="VND"
        allowRememberMe={true}
        prepopulatedEmail="test@test.com"
        onClose={this.onClose}
        onPaymentSuccess={this.onPaymentSuccess}
      />
    );
  }
}

export default PaymentStripe;
