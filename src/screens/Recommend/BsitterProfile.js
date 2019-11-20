import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';

import { MuliText } from 'components/StyledText';
import { Gender } from 'utils/Enum';
import { getProfileByRequest, getProfile } from 'api/babysitter.api';
import { createInvitation } from 'api/invitation.api';
import { createCustomer } from 'api/payment.api';
import { STRIPE_PUBLISHABLE_KEY as stripeKey } from 'react-native-dotenv';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import Api from 'api/api_helper';

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

  componentWillMount() {
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
    await Api.get('trackings/' + this.state.userId).then((res) => {
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
          }
        });
      } else {
        createInvitation(requestId, invitation, request)
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
        <View style={{ marginTop: 15, alignItems: 'center' }}>
          <MuliText style={styles.headerTitle}>
            Thông tin người giữ trẻ
          </MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Thông tin chi tiết người giữ trẻ
          </MuliText>
        </View>
        <View style={styles.container}>
          <ScrollView>
            {this.state.sitter && (
              <View style={styles.sectionContainer}>
                <View style={styles.headerSection}>
                  <MuliText
                    style={{ fontSize: 15, color: '#315f61', marginLeft: 10 }}
                  >
                    Thông tin cơ bản
                  </MuliText>
                </View>
                <View>
                  <MuliText style={styles.textField}>
                    Tên: {this.state.user.nickname}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Địa chỉ: {this.state.user.address}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Giới tính:{' '}
                    {this.state.user.gender == 'MALE'
                      ? Gender.MALE
                      : Gender.FEMALE}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Cách bạn: {this.state.distance} km
                  </MuliText>
                </View>
              </View>
            )}
            {this.state.sitter && (
              <View style={styles.sectionContainer}>
                <View style={styles.headerSection}>
                  <MuliText
                    style={{ fontSize: 15, color: '#315f61', marginLeft: 10 }}
                  >
                    Yêu cầu làm việc
                  </MuliText>
                </View>
                <View>
                  <MuliText style={styles.textField}>
                    Lịch rảnh: {this.state.sitter.weeklySchedule}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Buổi sáng: {this.state.sitter.daytime}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Buổi tối: {this.state.sitter.evening}
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Có thể trông trẻ tối thiểu:{' '}
                    {this.state.sitter.minAgeOfChildren} tuổi
                  </MuliText>
                  <MuliText style={styles.textField}>
                    Có thể trông tối đa: {this.state.sitter.maxNumOfChildren}{' '}
                    trẻ
                  </MuliText>
                </View>
                {this.state.sitter && (
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
                        <MuliText style={{ color: '#78ddb6', fontSize: 15 }}>
                          Mời
                        </MuliText>
                      </TouchableOpacity>
                    )}
                    {this.state.sitter.isInvited && (
                      <MuliText
                        style={{
                          marginTop: 10,
                          color: '#B81A1A',
                          fontSize: 15,
                        }}
                      >
                        Đã mời
                      </MuliText>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

// RecommendScreen.navigationOptions = {
//   title: 'Đề nghị người giữ trẻ',
// };

const styles = StyleSheet.create({
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    fontWeight: '200',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: 'white',
    // flex: 1,
    paddingBottom: 20,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 40,
    alignItems: 'center',
    marginBottom: 15,
  },
  inviteButton: {
    marginTop: 10,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  textField: {
    marginBottom: 10,
    fontSize: 11,
  },
});
