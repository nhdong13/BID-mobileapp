/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import localization from 'moment/locale/vi';
import colors from 'assets/Color';
import { listAllRequestInvitation } from 'api/invitation.api';
import {
  acceptBabysitter,
  updateRequestStatus,
  cancelRequest,
  getRequestDetail,
} from 'api/sittingRequest.api';
import { getRequestTransaction } from 'api/transaction.api';
import { withNavigationFocus } from 'react-navigation';
import Toast, { DURATION } from 'react-native-easy-toast';
import { createCharge } from 'api/payment.api';
import { formater } from 'utils/MoneyFormater';
import AlertPro from 'react-native-alert-pro';
import Loader from 'utils/Loader';

moment.updateLocale('vi', localization);

export class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId || 0,
      createUserId: 0,
      date: null,
      startTime: null,
      endTime: null,
      address: null,
      price: 0,
      bsitter: null,
      status: null,
      invitations: [],
      childrenNumber: 1,
      minAgeOfChildren: 1,
      isModalVisible: false,
      canCheckIn: null,
      canCheckOut: null,
      loading: false,
      chargeId: 0,
      amount: 0,
      notificationMessage: '',
      title: '',
      cancelAlert: 'Không',
      confirmAlert: 'Có',
      showConfirm: true,
      refreshing: false,
    };
    this.callDetail = this.callDetail.bind(this);
  }

  async componentDidMount() {
    this.getAcceptedInvitations();

    const { sittingRequestsID: requestId } = this.state;
    // rewrite api get request data
    await getRequestDetail(requestId).then((res) => {
      const {
        sittingDate: date,
        startTime,
        endTime,
        sittingAddress: address,
        status,
        childrenNumber,
        minAgeOfChildren,
        bsitter,
        canCheckIn,
        canCheckOut,
        totalPrice: price,
        createdUser: createUserId,
      } = res;
      this.setState({
        date,
        startTime,
        endTime,
        address,
        status,
        childrenNumber,
        minAgeOfChildren,
        bsitter,
        canCheckIn,
        canCheckOut,
        price,
        createUserId,
      });
    });
    // dong's code
    // Api.get('sittingRequests/' + requestId.toString())
    //   .then((resp) => {
    //     this.setState({
    //       date: resp.sittingDate,
    //       startTime: resp.startTime,
    //       endTime: resp.endTime,
    //       address: resp.sittingAddress,
    //       status: resp.status,
    //       childrenNumber: resp.childrenNumber,
    //       minAgeOfChildren: resp.minAgeOfChildren,
    //       bsitter: resp.bsitter,
    //       canCheckIn: resp.canCheckIn,
    //       canCheckOut: resp.canCheckOut,
    //       price: resp.totalPrice,
    //       createUserId: resp.createdUser,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log('PHUC: RequestDetail -> componentDidMount -> error', error);
    //   });
    const { status } = this.state;
    if (status === 'CONFIRMED') {
      console.log('PHUC: RequestDetail -> componentDidMount -> status', status);

      const transaction = await getRequestTransaction(requestId).then();
      console.log(
        'PHUC: RequestDetail -> componentDidMount -> requestId',
        requestId,
      );
      if (transaction) {
        const { chargeId, amount } = transaction;
        if (chargeId && amount) {
          this.setState({ chargeId, amount });
        }
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        const { sittingRequestsID: requestId } = this.state;
        const { chargeId, amount } = await getRequestTransaction(requestId);

        if (chargeId && amount) {
          this.setState({ chargeId, amount });
        } else {
          console.log('get request transaction ko chay roi');
        }
      }
    }
  }

  onButtonClick = (targetStatus) => {
    const data = {
      id: this.state.sittingRequestsID,
      status: targetStatus,
    };

    updateRequestStatus(data)
      .then(() => {
        this.props.navigation.navigate('Home', { loading: false });
      })
      .catch((error) => console.log(error));
  };

  onCancel = async () => {
    const { status } = this.state;
    if (status === 'CONFIRMED') {
      this.setState({
        title: 'Bạn có thật sự muốn hủy ?',
        notificationMessage:
          'Nếu hủy bạn sẽ bị trừ 10% phí dịch vụ vào số tiền đã trả',
        showConfirm: true,
      });
      this.AlertPro.open();
    } else {
      this.setState({
        title: 'Bạn có thật sự muốn hủy ?',
        notificationMessage: 'Bạn có muốn hủy yêu cầu này ?',
        showConfirm: true,
      });
      this.AlertPro.open();
    }
  };

  confirmCancel = async (status) => {
    const { sittingRequestsID: requestId, chargeId, amount } = this.state;
    console.log('PHUC: RequestDetail -> confirmCancel -> amount', amount);
    console.log('PHUC: RequestDetail -> confirmCancel -> chargeId', chargeId);
    console.log('PHUC: RequestDetail -> confirmCancel -> requestId', requestId);
    console.log('PHUC: RequestDetail -> confirmCancel -> status', status);

    if (requestId != 0 && chargeId != 0 && amount != 0) {
      this.setState({ loading: true });
      await cancelRequest(requestId, status, chargeId, amount).then((res) => {
        if (res.data) {
          this.setState({ loading: false });

          console.log('PHUC: RequestDetail -> confirmCancel -> res', res.data);
          this.AlertPro.close();
          this.props.navigation.navigate('Home', { loading: false });
        } else if (res.message.includes('Error')) {
          this.setState({ loading: false });

          this.refs.toast.show(
            'Đã có lỗi xảy ra, vui lòng thử lại sau một thời gian',
            DURATION.LENGTH_LONG,
          );
        }
      });
    } else {
      this.setState({ loading: true });

      await cancelRequest(requestId, 'PENDING', chargeId, amount).then(
        (res) => {
          if (res.data) {
            this.setState({ loading: false });

            console.log(
              'PHUC: RequestDetail -> confirmCancel -> res',
              res.data,
            );
            this.AlertPro.close();
            this.props.navigation.navigate('Home', { loading: false });
          } else if (res.message.includes('Error')) {
            this.setState({ loading: false });

            this.refs.toast.show(
              'Đã có lỗi xảy ra, vui lòng thử lại sau một thời gian',
              DURATION.LENGTH_LONG,
            );
          }
        },
      );
    }
  };

  onOpenQR = (targetStatus) => {
    const data = {
      id: this.state.sittingRequestsID,
      status: targetStatus,
    };

    this.props.navigation.navigate('QrScanner', {
      userId: this.state.bsitter.id,
      data: data,
    });
  };

  onOpenQRwhenDone = (targetStatus) => {
    const data = {
      id: this.state.sittingRequestsID,
      status: targetStatus,
    };

    this.props.navigation.navigate('QrScanner', {
      userId: this.state.bsitter.id,
      isDone: true,
      sittingId: this.state.sittingRequestsID,
      data: data,
    });
  };

  getAcceptedInvitations = async () => {
    // const data = await listByRequestAndStatus(
    //   this.state.sittingRequestsID,
    //   'ACCEPTED',
    // );

    await listAllRequestInvitation(this.state.sittingRequestsID).then(
      (invitations) => {
        if (invitations.data) {
          const results = invitations.data;
          const invitationsPending = results.filter(
            (invitation) => invitation.status == 'PENDING',
          );

          const invitationsAccepted = results.filter(
            (invitation) => invitation.status == 'ACCEPTED',
          );

          const invitationsDecline = results.filter(
            (invitation) => invitation.status == 'DENIED',
          );

          const listInvitation = [
            ...invitationsAccepted,
            ...invitationsPending,
            ...invitationsDecline,
          ];

          this.setState({ invitations: listInvitation });
        }
      },
    );
  };

  getRequestDetail = async () => {
    const { sittingRequestsID: requestId } = this.state;
    // rewrite api get request data
    await getRequestDetail(requestId).then((res) => {
      const {
        sittingDate: date,
        startTime,
        endTime,
        sittingAddress: address,
        status,
        childrenNumber,
        minAgeOfChildren,
        bsitter,
        canCheckIn,
        canCheckOut,
        totalPrice: price,
        createdUser: createUserId,
      } = res;
      // console.log(
      //   'PHUC: RequestDetail -> getRequestDetail -> bsitter',
      //   bsitter,
      // );
      this.setState({
        date,
        startTime,
        endTime,
        address,
        status,
        childrenNumber,
        minAgeOfChildren,
        bsitter,
        canCheckIn,
        canCheckOut,
        price,
        createUserId,
      });
    });
  };

  acceptBabysitter = (sitterId, name) => {
    const msg =
      'Bạn có chắc chắn chọn ' +
      name +
      ' không? \nBạn sẽ bị trừ ' +
      formater(this.state.price) +
      ' VND';
    Alert.alert(
      'Xác nhận thanh toán',
      msg,
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            // xác nhận thanh toán + accept babysitter
            acceptBabysitter(this.state.sittingRequestsID, sitterId)
              .then(() => {
                const {
                  sittingRequestsID: requestId,
                  price,
                  createUserId: userId,
                } = this.state;
                if (requestId != 0 && price != 0 && userId != 0) {
                  createCharge(price, userId, requestId).then((res) => {
                    if (res) {
                      this.props.navigation.navigate('Home');
                    }
                  });
                }
              })
              .catch((error) => {
                if (error.response.status == 409) {
                  this.setState({
                    title: 'Người giữ trẻ không phù hợp',
                    notificationMessage:
                      'Người giữ trẻ này không còn phù hợp với yêu cầu của bạn.',
                    showConfirm: false,
                    cancelAlert: 'Đóng',
                  });
                  this.AlertPro.open();

                  const errorSitterId = error.response.data;

                  this.setState((prevState) => ({
                    invitations: prevState.invitations.filter(
                      (el) => el.receiver != errorSitterId,
                    ),
                  }));
                }
              });
          },
        },
      ],
      { cancelable: false },
    );
  };

  _onRefresh = async () => {
    this.setState({ loading: true });
    await this.getAcceptedInvitations();
    await this.getRequestDetail();
    this.setState({ loading: false });
  };

  callDetail() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  render() {
    const {
      title,
      notificationMessage,
      cancelAlert,
      confirmAlert,
      showConfirm,
      refreshing,
      loading,
      sittingRequestsID: requestId,
    } = this.state;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }
      >
        <Loader loading={loading} />
        <Toast ref="toast" position="top" />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.confirmCancel('CANCELED')}
          onCancel={() => this.AlertPro.close()}
          title={title}
          message={notificationMessage}
          textCancel={cancelAlert}
          textConfirm={confirmAlert}
          showConfirm={showConfirm}
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
              backgroundColor: colors.blueAqua,
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
                {this.state.status == 'PENDING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'DONE_UNCONFIMRED' && (
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'SITTER_NOT_CHECKIN' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'DONE_BY_NEWSTART' && (
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'DONE' && (
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'ONGOING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.ongoing }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'CANCELED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'CONFIRMED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.confirmed }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
                {this.state.status == 'EXPIRED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.status}
                  </MuliText>
                )}
              </MuliText>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => {
                this.callDetail();
              }}
              title="Show more detail"
              style={{ marginLeft: 10 }}
            >
              <MuliText style={{ color: colors.blueAqua }}>
                {this.state.isModalVisible ? ' Ẩn đi' : 'Xem thêm'}
              </MuliText>
            </TouchableOpacity>
            {this.state.isModalVisible && (
              <View>
                <View style={styles.detailContainer}>
                  <MuliText style={styles.headerTitle}>Trẻ em</MuliText>
                  <View>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.childrenInformationContainer}>
                          <View style={styles.detailChildrenInformation}>
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
                            Số trẻ:
                          </MuliText>
                        </View>
                        <View style={styles.childrenInformationContainer}>
                          <View style={styles.detailChildrenInformation}>
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
              </View>
            )}
          </View>
          {/* render button according status */}
          {/* render babysitter if exist */}
          {this.state.bsitter ? (
            <View style={styles.detailPictureContainer}>
              <Image
                source={{ uri: this.state.bsitter.image }}
                style={styles.profileImg}
              />
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>
                  Người giữ trẻ
                </MuliText>
                <MuliText style={{ fontSize: 15 }}>
                  {this.state.bsitter.nickname}
                </MuliText>
              </View>
            </View>
          ) : (
            <View />
          )}
          {/* end */}
          {/*  Confirm a sitter */}

          {this.state.status == 'PENDING' && this.state.invitations.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerSection}>
                <MuliText style={styles.headerTitle}>
                  Xác nhận người giữ trẻ
                </MuliText>
              </View>
              <ScrollView>
                {this.state.invitations && this.state.invitations != [] ? (
                  this.state.invitations.map((item) => (
                    <View key={item.id} style={styles.detailPictureContainer}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                        }}
                      >
                        <Image
                          source={{ uri: item.user.image }}
                          style={
                            item.status != 'DENIED'
                              ? styles.profileImg
                              : styles.profileImgDenied
                          }
                        />

                        <View style={styles.leftInformationSitter}>
                          <MuliText style={styles.pictureInformationSitter}>
                            Người giữ trẻ
                          </MuliText>
                          {item.status != 'DENIED' ? (
                            <MuliText style={{ fontSize: 15 }}>
                              {item.user.nickname}
                            </MuliText>
                          ) : (
                            <MuliText
                              style={{ fontSize: 15, color: colors.gray }}
                            >
                              {item.user.nickname}
                            </MuliText>
                          )}
                          <View style={styles.lowerText}>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons
                                name="ios-pin"
                                size={17}
                                style={{ marginBottom: 2 }}
                                color={
                                  item.status != 'DENIED'
                                    ? colors.lightGreen
                                    : colors.gray
                                }
                              />
                              <MuliText
                                style={
                                  item.status != 'DENIED'
                                    ? { marginLeft: 3 }
                                    : { marginLeft: 3, color: colors.gray }
                                }
                              >
                                {item.distance}
                              </MuliText>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons
                                name="ios-star"
                                size={17}
                                style={{ marginBottom: 2, marginLeft: 5 }}
                                color={
                                  item.status != 'DENIED'
                                    ? colors.lightGreen
                                    : colors.gray
                                }
                              />
                              <MuliText
                                style={
                                  item.status != 'DENIED'
                                    ? { marginLeft: 3 }
                                    : { marginLeft: 3, color: colors.gray }
                                }
                              >
                                {item.user.babysitter.averageRating}
                              </MuliText>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {item.status == 'ACCEPTED' && (
                        <View style={styles.rightInformationSitter}>
                          <View>
                            <TouchableOpacity
                              style={styles.inviteButton}
                              onPress={() =>
                                item.status != 'ACCEPTED'
                                  ? null
                                  : this.acceptBabysitter(
                                      item.user.id,
                                      item.user.nickname,
                                    )
                              }
                            >
                              <MuliText
                                style={{ color: 'white', fontSize: 11 }}
                              >
                                Chấp nhận
                              </MuliText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      {item.status == 'PENDING' && (
                        <View style={styles.rightInformationSitter}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 1,
                              // backgroundColor: 'red',
                              width: 80,
                            }}
                          >
                            <MuliText
                              style={{ color: colors.gray, fontSize: 11 }}
                            >
                              Đang chờ
                            </MuliText>
                          </View>
                        </View>
                      )}
                      {item.status == 'DENIED' && (
                        <View style={styles.rightInformationSitter}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              flex: 1,
                              width: 80,
                            }}
                          >
                            <MuliText
                              style={{ color: colors.canceled, fontSize: 11 }}
                            >
                              Đã từ chối
                            </MuliText>
                          </View>
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <ActivityIndicator
                    size="large"
                    animating={this.state.loading}
                  />
                )}
              </ScrollView>
            </View>
          )}
          {this.state.status == 'PENDING' &&
            this.state.invitations.length == 0 && (
              <View style={styles.statusText}>
                <MuliText style={{ color: colors.gray, fontSize: 12 }}>
                  Chưa có người giữ trẻ nào chấp nhận yêu cầu của bạn
                </MuliText>
              </View>
            )}
          {this.state.status == 'CANCELED' && (
            <View style={styles.statusText}>
              <MuliText style={{ color: colors.gray }}>
                Bạn đã hủy yêu cầu này
              </MuliText>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {(this.state.status == 'PENDING' ||
              this.state.status == 'CONFIRMED') && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.onCancel()}
              >
                <MuliText style={{ color: colors.canceled, fontSize: 12 }}>
                  Hủy
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.canCheckIn && this.state.status == 'CONFIRMED' && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.onOpenQR('ONGOING');
                }}
              >
                <MuliText style={{ color: colors.done, fontSize: 12 }}>
                  Người giữ trẻ Check-in
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.canCheckOut && this.state.status == 'ONGOING' && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.onOpenQRwhenDone('DONE');
                }}
              >
                <MuliText style={{ color: colors.overlap, fontSize: 11 }}>
                  Xác nhận công việc hoàn thành
                </MuliText>
              </TouchableOpacity>
            )}
            {(this.state.status == 'DONE' ||
              this.state.status == 'DONE_UNCONFIMRED' ||
              this.state.status == 'DONE_BY_NEWSTART' ||
              this.state.status == 'SITTER_NOT_CHECKIN') && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.props.navigation.navigate('Feedback', {
                    requestId: requestId,
                  });
                }}
              >
                <MuliText style={{ color: colors.blueAqua, fontSize: 11 }}>
                  Đánh giá cho yêu cầu trông trẻ này
                </MuliText>
              </TouchableOpacity>
            )}
          </View>
          {this.state.status == 'ACCEPTED' || this.state.status == 'DENIED' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: colors.done, fontSize: 11 }}>
                  Chấp nhận
                </MuliText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: colors.canceled, fontSize: 11 }}>
                  Từ chối
                </MuliText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              {this.state.status == 'PENDING' && (
                <TouchableOpacity
                  style={styles.listBabySitterButton}
                  onPress={() => {
                    this.props.navigation.navigate('Recommend', {
                      requestId: this.state.sittingRequestsID,
                    });
                  }}
                >
                  <MuliText style={{ color: colors.overlap, fontSize: 13 }}>
                    Danh sách người giữ trẻ
                  </MuliText>
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* end */}
          <View style={styles.buttonContainer}>
            {(this.state.status == 'DONE' ||
              this.state.status == 'DONE_UNCONFIMRED' ||
              this.state.status == 'DONE_BY_NEWSTART' ||
              this.state.status == 'SITTER_NOT_CHECKIN') && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ReportScreen', {
                    requestId: this.state.sittingRequestsID,
                  });
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Ionicons name="ios-warning" size={25} color="red" />
                  <MuliText style={{ color: 'red' }}>Báo cáo vi phạm</MuliText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withNavigationFocus(RequestDetail);

RequestDetail.navigationOptions = {
  title: 'Yêu cầu chi tiết',
};

const styles = StyleSheet.create({
  statusText: {
    marginHorizontal: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  textChildrenInformation: {
    marginLeft: 10,
    fontSize: 15,
  },
  detailChildrenInformation: {
    flexDirection: 'row',
    marginTop: 25,
  },
  rightInformationSitter: {
    marginLeft: 'auto',
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  pictureInformationSitter: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray,
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray,
  },
  leftInformationSitter: {
    marginLeft: 5,
  },
  leftInformation: {
    marginTop: 5,
    marginLeft: 5,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    height: 80,
    width: 140,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  lowerText: {
    flexDirection: 'row',
  },
  sectionContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 20,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    height: 20,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
  },
  inviteButton: {
    flex: 1,
    width: 80,
    height: 25,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 45,
  },
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  listBabySitterButton: {
    marginVertical: 5,
    width: '100%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  detailContainer: {
    marginTop: 15,
  },
  name: {
    alignItems: 'center',
  },
  submitButton: {
    width: 250,
    height: 30,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    marginHorizontal: 10,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 14,
    color: colors.darkGreenTitle,
    marginBottom: 5,
    fontWeight: '800',
    marginLeft: 5,
  },
  profileImg: {
    width: 60,
    height: 60,
    // borderRadius: 140 / 2,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  profileImgDenied: {
    width: 60,
    height: 60,
    // borderRadius: 140 / 2,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'black',
    opacity: 0.1,
  },
  informationText: {
    fontSize: 13,
    marginTop: 15,
    flexDirection: 'row',
    color: colors.gray,
  },
  contentInformation: {
    fontSize: 12,
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
});
