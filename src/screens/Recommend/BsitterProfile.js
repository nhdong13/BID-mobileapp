import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { getProfileByRequest, getProfile } from 'api/babysitter.api';
import { createInvitation } from 'api/invitation.api';
import { createCustomer } from 'api/payment.api';
import { STRIPE_PUBLISHABLE_KEY as stripeKey } from 'react-native-dotenv';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import moment from 'moment';
// import { createRepeatedRequest } from 'api/repeatedRequest.api';

export default class BsitterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: 0,
      sitterId: 0,
      userId: 0,
      request: null,
      distance: 0,
      sitter: {},
      user: {},
    };
  }

  componentDidMount() {
    Stripe.setOptionsAsync({
      publishableKey: stripeKey,
      androidPayMode: 'test',
    });
    const {
      sitterId,
      requestId,
      request,
      distance,
      userId,
    } = this.props.navigation.state.params;

    if (sitterId && sitterId != 0) {
      this.setState(
        {
          sitterId,
          requestId,
          request,
          distance,
          userId,
        },
        () => this.getBabysitter(),
      );
    } else {
      console.log('Recommend/BsitterProfile - sitterId not found');
    }
  }

  getBabysitter = async () => {
    const { sitterId, requestId } = this.state;
    if (sitterId != 0 && requestId != 0) {
      const data = await getProfileByRequest(sitterId, requestId);
      this.setState({
        sitter: data,
        user: data.user,
      });

      return data;
    }

    if (sitterId != 0) {
      const data = await getProfile(sitterId);
      this.setState({
        sitter: data,
        user: data.user,
      });

      return data;
    }

    return [];
  };

  sendInvitation = async (sitterId, requestId, request) => {
    const invitation = {
      requestId: requestId,
      status: 'PENDING',
      receiver: sitterId,
      distance: this.state.distance,
    };
    // console.log(invitation);
    await Api.get('trackings/' + this.state.userId).then(async (res) => {
      if (res.customerId == null || res.cardId == null) {
        this.createCard().then(async (res) => {
          if (res) {
            await createInvitation(requestId, invitation, request)
              .then((response) => {
                this.changeInviteStatus();
                this.setState({ requestId: response.data.newRequest.id });
                this.props.navigation.state.params.onGoBack(
                  sitterId,
                  response.data.newRequest.id,
                );
              })
              .catch((error) => console.log(error));
            // if (repeatedData) {
            //   const {
            //     sittingDate: startDate,
            //     startTime,
            //     endTime,
            //     sittingAddress,
            //     createdUser,
            //   } = request;

            //   const { repeatedDays } = repeatedData;

            //   const data = {
            //     startDate,
            //     startTime,
            //     endTime,
            //     sittingAddress,
            //     repeatedDays,
            //     createdUser,
            //   };

            //   console.log('PHUC: Bsitter -> sendInvitation -> data', data);

            //   await createRepeatedRequest(data).catch((error) => {
            //     console.log(
            //       'PHUC: BsitterProfile -> repeatedRequest -> error',
            //       error,
            //     );
            //   });
            // }
          }
        });
      } else {
        await createInvitation(requestId, invitation, request)
          .then((response) => {
            if (invitation.requestId == 0) {
              this.changeInviteStatus(sitterId);
              this.props.navigation.state.params.onGoBack(
                sitterId,
                response.data.newRequest.id,
              );
            } else if (invitation.requestId != 0) {
              this.changeInviteStatus(sitterId);
              this.props.navigation.state.params.onGoBack(
                sitterId,
                invitation.requestId,
              );
            }
          })
          .catch((error) =>
            console.log(
              'Error in BsitterProfile -> CreateInvitation when have card',
              error,
            ),
          );
        // if (repeatedData) {
        //   const {
        //     sittingDate: startDate,
        //     startTime,
        //     endTime,
        //     sittingAddress,
        //     createdUser,
        //   } = request;

        //   const { repeatedDays } = repeatedData;

        //   const data = {
        //     startDate,
        //     startTime,
        //     endTime,
        //     sittingAddress,
        //     repeatedDays,
        //     createdUser,
        //   };

        //   console.log('PHUC: Bsitter -> sendInvitation -> data', data);

        //   await createRepeatedRequest(data).catch((error) => {
        //     console.log(
        //       'PHUC: BsitterProfile -> repeatedRequest -> error',
        //       error,
        //     );
        //   });
        // }
      }
    });
  };

  changeInviteStatus = () => {
    this.setState((prevState) => ({
      sitter: Object.assign(prevState.sitter, { isInvited: true }),
    }));
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

  // netstat -ano | findstr 3000
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <ScrollView>
            {this.state.sitter && (
              <View style={styles.sectionContainer}>
                <View style={styles.headerSection}>
                  <MuliText style={styles.textInformation}>
                    Thông tin cơ bản
                  </MuliText>
                </View>
                <View style={{ flexDirection: 'row', marginRight: 10 }}>
                  <View>
                    <Image
                      source={{ uri: this.state.user.image }}
                      style={styles.picture}
                    />
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <MuliText style={styles.textField}>
                      Tên: {this.state.user.nickname}
                    </MuliText>

                    <MuliText style={styles.textField}>
                      Giới tính:{' '}
                      {this.state.user.gender == 'MALE' && (
                        <Ionicons
                          name="ios-male"
                          size={18}
                          style={{ marginBottom: -3, marginLeft: 5 }}
                          color={colors.blueAqua}
                        />
                      )}
                      {this.state.user.gender == 'FEMALE' && (
                        <Ionicons
                          name="ios-female"
                          size={18}
                          style={{ marginBottom: -3, marginLeft: 5 }}
                          color={colors.pinkLight}
                        />
                      )}
                    </MuliText>
                    <MuliText style={styles.textField}>
                      Cách bạn: {this.state.distance}
                    </MuliText>
                  </View>
                  <View style={styles.buttonContainer}>
                    {!this.state.sitter.isInvited && (
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() =>
                          this.sendInvitation(
                            this.state.sitter.userId,
                            this.state.requestId,
                            this.state.request,
                          )
                        }
                      >
                        <MuliText
                          style={{ color: colors.lightGreen, fontSize: 15 }}
                        >
                          Mời
                        </MuliText>
                      </TouchableOpacity>
                    )}
                    {this.state.sitter.isInvited && (
                      <MuliText
                        style={{
                          marginTop: 10,
                          color: colors.canceled,
                          fontSize: 15,
                        }}
                      >
                        Đã mời
                      </MuliText>
                    )}
                  </View>
                </View>
                <MuliText style={styles.textField}>
                  Địa chỉ: {this.state.user.address}
                </MuliText>
              </View>
            )}
            {this.state.sitter && (
              <View style={styles.sectionContainer}>
                <View style={styles.headerSection}>
                  <MuliText style={styles.textInformation}>
                    Lịch làm việc
                  </MuliText>
                </View>
                <View>
                  <MuliText style={styles.textField}>
                    Lịch làm việc: {this.state.sitter.weeklySchedule}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Giờ bắt đầu:{' '}
                    {moment
                      .utc(this.state.sitter.startTime, 'HH:mm')
                      .format('HH:mm giờ')}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Giờ kết thúc:{' '}
                    {moment
                      .utc(this.state.sitter.endTime, 'HH:mm')
                      .format('HH:mm giờ')}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Trông trẻ nhỏ nhất: {this.state.sitter.minAgeOfChildren}{' '}
                    tuổi
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Số trẻ nhiều nhất có thể trông:{' '}
                    {this.state.sitter.maxNumOfChildren} trẻ
                  </MuliText>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: 'hidden',
  },
  textInformation: {
    fontSize: 20,
    color: colors.darkGreenTitle,
    marginLeft: 10,
  },
  grayOptionInformation: {
    color: colors.gray,
    fontWeight: '200',
  },
  headerTitle: {
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 15,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingBottom: 5,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    height: 40,
    alignItems: 'center',
    marginBottom: 15,
  },
  inviteButton: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginLeft: 'auto',
    alignItems: 'center',
  },
  textField: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
