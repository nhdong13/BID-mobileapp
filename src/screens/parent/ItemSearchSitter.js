import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { createInvitation } from 'api/invitation.api';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import colors from 'assets/Color';
import { withNavigation } from 'react-navigation';
import { STRIPE_PUBLISHABLE_KEY as stripeKey } from 'react-native-dotenv';
import Api from 'api/api_helper';
import { retrieveToken } from 'utils/handleToken';
import { createCustomer } from 'api/payment.api';

export class ItemSearchSitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      email: '',
      name: '',
      requestId: 0,
    };
  }

  componentDidMount() {
    Stripe.setOptionsAsync({
      publishableKey: stripeKey,
      androidPayMode: 'test',
    });
    this.getUserData();
  }

  getUserData() {
    retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });

      Api.get('users/' + userId.toString()).then((res) => {
        this.setState({ email: res.email, name: res.nickname });
      });
    });
  }

  calAge = (dateOfBirth) => {
    const born = this.getYear(dateOfBirth);
    const now = moment().year();
    return now - born;
  };

  getYear = (dateOfBirth) => {
    const arr = dateOfBirth.split('-');
    return arr[0];
  };

  sendInvitation = async (receiverId) => {
    // console.log('it go here');
    const { requestId, request, item } = this.props;

    const invitation = {
      requestId: requestId,
      status: 'PENDING',
      receiver: receiverId,
      distance: item.distance,
    };
    // console.log(request);
    await Api.get('trackings/' + this.state.userId).then((res) => {
      // console.log(res.customerId);
      if (res.customerId == null || res.cardId == null) {
        this.createCard().then(async (res) => {
          if (res) {
            await createInvitation(requestId, invitation, request)
              .then((response) => {
                // console.log(response);
                this.props.changeInviteStatus(receiverId);
                this.props.setRequestId(response.data.newRequest.id);
              })
              .catch((error) => console.log('aaa', error));
          }
        });
      } else {
        console.log('ItemSearchSitter: ------ ');
        createInvitation(requestId, invitation, request)
          .then((response) => {
            console.log(response);
            this.props.changeInviteStatus(receiverId);
            this.props.setRequestId(response.data.newRequest.id);
          })
          .catch((error) => console.log('--- Create invitation error', error));
      }
    });
  };

  createCard = async () => {
    const token = await Stripe.paymentRequestWithCardFormAsync().catch(
      (error) => console.log(error),
    );
    if (token) {
      createCustomer(
        this.state.email,
        token.tokenId,
        this.state.userId,
        this.state.name,
        token.card.cardId,
      );
    }
    return token;
  };

  changeStateOnGoBack(receiverId, requestId) {
    this.props.changeInviteStatus(receiverId);
    this.props.setRequestId(requestId);
    this.setState({ requestId });
  }

  render() {
    const { item } = this.props;
    return (
      <View key={item.userId} style={styles.ItemSearchSitterContainer}>
        <View style={styles.ItemSearchSitterItem}>
          <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
            <Image
              source={{ uri: item.user.image }}
              style={styles.sitterImage}
            />
            <View>
              <View style={styles.upperText}>
                <MuliText style={styles.ItemSearchSitterName}>
                  {item.user.nickname} - {this.calAge(item.user.dateOfBirth)}
                  tuổi
                </MuliText>
                {item.user.gender == 'MALE' && (
                  <Ionicons
                    name="ios-male"
                    size={18}
                    style={{ marginBottom: -3, marginLeft: 5 }}
                    color={colors.blueAqua}
                  />
                )}
                {item.user.gender == 'FEMALE' && (
                  <Ionicons
                    name="ios-female"
                    size={18}
                    style={{ marginBottom: -3, marginLeft: 5 }}
                    color={colors.pinkLight}
                  />
                )}
              </View>
              <View style={styles.lowerText}>
                <Ionicons
                  name="ios-star"
                  size={19}
                  style={{ marginLeft: 5 }}
                  color={colors.lightGreen}
                />

                <MuliText
                  style={item.totalFeedback > 10 ? styles.green : styles.red}
                >
                  {item.averageRating.toFixed(0)} ({item.totalFeedback})
                </MuliText>
              </View>
            </View>
          </TouchableOpacity>
          <View />
          {!item.isInvited && (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => {
                this.sendInvitation(item.userId);
                this.props.navigation.navigate('Home');
              }}
            >
              <MuliText style={{ color: colors.lightGreen, fontSize: 13 }}>
                Mời
              </MuliText>
            </TouchableOpacity>
          )}
          {item.isInvited && (
            <View style={styles.inviteButton}>
              <MuliText style={{ color: colors.canceled, fontSize: 13 }}>
                Đã mời
              </MuliText>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(ItemSearchSitter);

const styles = StyleSheet.create({
  green: {
    marginLeft: 5,
    color: colors.done,
  },
  red: {
    marginLeft: 5,
    color: colors.canceled,
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray,
    paddingBottom: 20,
  },
  ItemSearchSitterContainer: {
    marginVertical: 8,
  },
  ItemSearchSitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 10,
  },
  lowerText: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  inviteButton: {
    marginTop: 14,
  },
  ItemSearchSitterName: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.darkGreenTitle,
  },
  sitterImage: {
    width: 55,
    height: 55,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
