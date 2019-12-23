/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import localization from 'moment/locale/vi';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import { updateInvitation } from 'api/invitation.api';
import { formater } from 'utils/MoneyFormater';
import AlertPro from 'react-native-alert-pro';
import { getRepeatedRequest } from 'api/repeatedRequest.api';
import { retrieveToken } from 'utils/handleToken';

moment.updateLocale('vi', localization);

export default class InvitationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      parentImage: '',
      invitationID: this.props.navigation.state.params.invitationId,
      date: '2019-10-03',
      startTime: '12:00 AM',
      endTime: '3:00 AM',
      address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
      price: 0,
      detailPictureParent: require('assets/images/Phuc.png'),
      parentName: 'Phuc',
      status: null,
      isModalVisible: false,
      invitationStatus: 'PENDING',
      childrenNumber: 1,
      minAgeOfChildren: 1,
      createUserId: 0,
      requestId: 0,
      notificationMessage: 'Your request have been accepted',
      title: 'Request confirmation',
      loading: false,
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
      repeatedRequestId: null,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      isCancel: false,
    };
  }

  async componentDidMount() {
    await retrieveToken().then(async (res) => {
      const { userId } = res;
      await this.setState({ userId });
    });
    this.getData();
  }

  getData = async () => {
    await Api.get('invitations/' + this.state.invitationID.toString()).then(
      async (resp) => {
        // console.log('PHUC: InvitationDetail -> getData -> resp', resp);
        if (resp.sittingRequest.repeatedRequestId) {
          this.setState(
            {
              createUserId: resp.sittingRequest.user.id,
              parentName: resp.sittingRequest.user.nickname,
              parentImage: resp.sittingRequest.user.image,
              invitationStatus: resp.status,
              date: resp.sittingRequest.sittingDate,
              startTime: resp.sittingRequest.startTime,
              endTime: resp.sittingRequest.endTime,
              address: resp.sittingRequest.sittingAddress,
              status: resp.sittingRequest.status,
              price: resp.sittingRequest.totalPrice,
              childrenNumber: resp.sittingRequest.childrenNumber,
              minAgeOfChildren: resp.sittingRequest.minAgeOfChildren,
              requestId: resp.sittingRequest.id,
              repeatedRequestId: resp.sittingRequest.repeatedRequestId,
            },
            () => this.getRepeatedRequest(),
          );
        } else {
          this.setState({
            createUserId: resp.sittingRequest.user.id,
            parentName: resp.sittingRequest.user.nickname,
            parentImage: resp.sittingRequest.user.image,
            invitationStatus: resp.status,
            date: resp.sittingRequest.sittingDate,
            startTime: resp.sittingRequest.startTime,
            endTime: resp.sittingRequest.endTime,
            address: resp.sittingRequest.sittingAddress,
            status: resp.sittingRequest.status,
            price: resp.sittingRequest.totalPrice,
            childrenNumber: resp.sittingRequest.childrenNumber,
            minAgeOfChildren: resp.sittingRequest.minAgeOfChildren,
            requestId: resp.sittingRequest.id,
          });
        }
      },
    );
  };

  getRepeatedRequest = async () => {
    const { userId, requestId } = this.state;
    if (userId != 0) {
      await getRepeatedRequest(requestId).then((res) => {
        if (res.data) {
          const response = res.data;

          const workDays = response[0].repeatedRequest.repeatedDays.split(',');
          workDays.forEach((day) => {
            switch (day) {
              case 'MON':
                this.setState({ mon: true });
                break;
              case 'TUE':
                this.setState({ tue: true });
                break;
              case 'WED':
                this.setState({ wed: true });
                break;
              case 'THU':
                this.setState({ thu: true });
                break;
              case 'FRI':
                this.setState({ fri: true });
                break;
              case 'SAT':
                this.setState({ sat: true });
                break;
              case 'SUN':
                this.setState({ sun: true });
                break;
              default:
                console.log(
                  'Error in getprofile sitter -> CalendarScreen -> switch',
                );
                break;
            }
          });
        }
      });
    }
  };

  onLogin = () => {
    this.setState({ isModalVisible: true });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  // hoi ban co chac chan muon chap nhan khong, hoi ban co chac chan muon tu choi ko

  onButtonClick = (targetStatus) => {
    const ivBody = {
      id: this.state.invitationID,
      status: targetStatus,
    };
    updateInvitation(ivBody)
      .then(() => {
        this.props.navigation.navigate('Home', { loading: false });
      })
      .catch((error) => console.log(error));
  };

  confirmModalPopup = () => {
    const { repeatedRequestId } = this.state;
    if (repeatedRequestId) {
      this.setState({
        notificationMessage:
          'Đây là một yêu cầu lặp lại, nếu chấp nhận bạn sẽ đồng ý với việc thực hiên yêu cầu này lặp lại trong vòng 4 tuần, bạn có chắc chắn không ?',
        title: 'Đồng ý chấp nhận yêu cầu lặp lại',
        showConfirm: true,
        textConfirm: 'Có',
        showCancel: true,
        textCancel: 'Không',
      });
      this.AlertPro.open();
    } else {
      this.setState({
        notificationMessage:
          'Bạn có chăc chắn muốn chấp nhận yêu cầu này không ?',
        title: 'Đồng ý chấp nhận yêu cầu giữ trẻ',
        showConfirm: true,
        textConfirm: 'Có',
        showCancel: true,
        textCancel: 'Không',
      });
      this.AlertPro.open();
    }
  };

  cancelModalPopup = () => {
    this.setState({
      notificationMessage: 'Bạn có chăc chắn muốn từ chối lời mời này không ?',
      title: 'Từ chối lời mời giữ trẻ',
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
      isCancel: true,
    });
    this.AlertPro.open();
  };

  render() {
    const {
      notificationMessage,
      showCancel,
      showConfirm,
      textCancel,
      textConfirm,
      title,
    } = this.state;
    return (
      <ScrollView>
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() =>
            this.state.isCancel
              ? this.onButtonClick('DENIED')
              : this.onButtonClick('ACCEPTED')
          }
          onCancel={() => this.AlertPro.close()}
          title={title}
          message={notificationMessage}
          showConfirm={showConfirm}
          showCancel={showCancel}
          textCancel={textCancel}
          textConfirm={textConfirm}
          customStyles={{
            mask: {
              backgroundColor: 'transparent',
            },
            container: {
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            buttonCancel: {
              backgroundColor: colors.canceled,
            },
            buttonConfirm: {
              backgroundColor: colors.buttonConfirm,
            },
          }}
        />
        <View style={{ marginHorizontal: 30, backgroundColor: 'white' }}>
          <View style={styles.detailInformationContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-calendar"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
              />
              <MuliText style={styles.contentInformationDate}>
                {moment(this.state.date).format('dddd Do MMMM')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {formater(this.state.price)} VND
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-timer"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {moment.utc(this.state.startTime, 'HH:mm').format('HH:mm')} -
                {moment.utc(this.state.endTime, 'HH:mm').format('HH:mm')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-home"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {this.state.address}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-megaphone"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {this.state.invitationStatus == 'PENDING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'ACCEPTED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.lightGreen }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'DONE' && (
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'ONGOING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.ongoing }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'EXPIRED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'CONFIRMED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.confirmed }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'SITTER_NOT_CHECKIN' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'PARENT_CANCELED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
              </MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detailPictureContainer}>
              <Image
                source={{ uri: this.state.parentImage }}
                style={styles.profileImg}
              />
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>Phụ huynh</MuliText>
                <MuliText style={{ fontSize: 15 }}>
                  {this.state.parentName}
                </MuliText>
              </View>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>Trẻ em</MuliText>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.childrenInformationContainer}>
                    <View style={styles.detailChildrenContainer}>
                      <Ionicons
                        name="ios-man"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color={colors.lightGreen}
                      />
                      <View>
                        <MuliText style={styles.textChildrenInformation}>
                          {this.state.childrenNumber}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Số trẻ
                    </MuliText>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={styles.detailChildrenContainer}>
                      <Ionicons
                        name="ios-happy"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color={colors.lightGreen}
                      />
                      <View>
                        <MuliText style={styles.textChildrenInformation}>
                          {this.state.minAgeOfChildren}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Nhỏ tuổi nhất:
                    </MuliText>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          {this.state.repeatedRequestId != null ? (
            <View style={styles.repeatedRequest}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#ecf0f1',
                  flex: 1,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ sun: !this.state.sun })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sun ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      CN
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ mon: !this.state.mon })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.mon ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T2
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ tue: !this.state.tue })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.tue ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T3
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ wed: !this.state.wed })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.wed ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T4
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ thu: !this.state.thu })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.thu ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T5
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ fri: !this.state.fri })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.fri ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T6
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  // onPress={() => this.setState({ sat: !this.state.sat })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sat ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T7
                    </MuliText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={{ alignItems: 'center', flex: 1 }}>
            {this.state.invitationStatus == 'PENDING' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  // onPress={() => this.onButtonClick('DENIED')}
                  onPress={() => this.cancelModalPopup()}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 35,
                      padding: 5,
                      marginHorizontal: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MuliText style={{ color: colors.canceled, fontSize: 15 }}>
                      Từ chối
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  // onPress={() => this.onButtonClick('ACCEPTED')}
                  onPress={() => this.confirmModalPopup()}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 35,
                      padding: 5,
                      marginHorizontal: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: colors.done,
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  >
                    <MuliText style={{ color: colors.done, fontSize: 15 }}>
                      Chấp nhận
                    </MuliText>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            {(this.state.status == 'DONE' ||
              this.state.status == 'DONE_UNCONFIMRED' ||
              this.state.status == 'DONE_BY_NEWSTART' ||
              this.state.status == 'SITTER_NOT_CHECKIN') && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.props.navigation.navigate('Feedback', {
                    requestId: this.state.requestId,
                  });
                }}
              >
                <MuliText style={{ color: colors.blueAqua, marginLeft: 10 }}>
                  Đánh giá cho yêu cầu trông trẻ này
                </MuliText>
              </TouchableOpacity>
            )}
            {(this.state.status == 'DONE' ||
              this.state.status == 'DONE_UNCONFIMRED' ||
              this.state.status == 'DONE_BY_NEWSTART' ||
              this.state.status == 'SITTER_NOT_CHECKIN') && (
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('ReportScreen', {
                      requestId: this.state.requestId,
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                    <Ionicons name="ios-warning" size={25} color="red" />
                    <MuliText style={{ color: 'red', marginLeft: 5 }}>
                      Báo cáo vi phạm
                    </MuliText>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}
InvitationDetail.navigationOptions = {
  title: 'Chi tiết lời mời',
};

const styles = StyleSheet.create({
  detailChildrenContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  textChildrenInformation: {
    marginLeft: 15,
    fontSize: 15,
  },
  submitButton: {
    width: 250,
    height: 30,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 80,
    width: 140,
    elevation: 2,
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  leftInformation: {
    marginTop: 5,
    marginLeft: 5,
  },
  detailPictureContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 20,
    // marginHorizontal: 10,
    // backgroundColor: 'blue',
  },
  detailContainer: {
    marginVertical: 15,
  },
  acceptButton: {
    width: 100,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.done,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 5,
    fontWeight: '800',
  },

  profileImg: {
    width: 60,
    height: 60,
    // borderRadius: 140 / 2,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  informationText: {
    fontSize: 13,
    marginTop: 15,
    flexDirection: 'row',
    color: colors.gray,
  },
  contentInformation: {
    fontSize: 10,
    paddingLeft: 10,
    color: colors.darkGreenTitle,
  },
  contentInformationDate: {
    fontSize: 12,
    paddingLeft: 10,
    color: colors.darkGreenTitle,
    fontWeight: '700',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 5,
    marginLeft: 5,
  },

  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray,
  },
  optionInformation: {
    fontSize: 13,
    paddingLeft: 10,
    fontWeight: '400',
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    paddingLeft: 10,
    fontWeight: '200',
    marginTop: 5,
  },
  textOption: {
    marginHorizontal: 5,
  },
  repeatedRequest: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
});
