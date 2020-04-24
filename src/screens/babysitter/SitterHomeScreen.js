/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Toast, { DURATION } from 'react-native-easy-toast';
import { MuliText } from 'components/StyledText';
import { withNavigationFocus } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons/';
// import Loader from 'utils/Loader';
import WaitingInvitation from 'screens/babysitter/WaitingInvitation';
import PendingInvitation from 'screens/babysitter/PendingInvitation';
import colors from 'assets/Color';
import Api from 'api/api_helper';
import apiUrl from 'utils/Connection';
import { Notifications } from 'expo';
import AlertPro from 'react-native-alert-pro';
import Loader from 'utils/Loader';
import registerPushNotifications from 'utils/Notification';
import moment from 'moment';
import localization from 'moment/locale/vi';
import io from 'socket.io-client';
import UpcomingInvitation from 'screens/babysitter/UpcomingInvitation';
import { getRequests } from 'api/sittingRequest.api';
import { getRequestData } from 'api/babysitter.api';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get('window');

moment.updateLocale('vi', localization);

class SitterHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationsPending: null,
      invitationsUpcoming: null,
      invitationsWaiting: null,
      ongoingInvitation: null,
      userId: 0,
      refreshing: false,
      notificationMessage: 'Your request have been accepted',
      title: 'Request confirmation',
      loading: false,
      notification: {},
      index: 0,
      routes: [
        { key: 'Pending', title: 'Lời mời' },
        { key: 'Waiting', title: 'Đang chờ' },
      ],
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
      isModalVisible: false,
      ongoingParent: '',
      invitationId: null,
    };

    console.log(
      'PHUC: SitterHomeScreen -> constructor -> index',
      this.state.index,
    );
  }

  async componentDidMount() {
    await retrieveToken().then((res) => {
      const { userId } = res;
      // console.log(
      //   'PHUC: SitterHomeScreen -> componentDidMount -> userId',
      //   userId,
      // );
      this.setState({ userId });
      // this._notificationSubscription = Notifications.addListener(
      //   this.handleNotification,
      // );
    });
    await this.getInvitationData();

    const socketIO = io(apiUrl.socket, {
      transports: ['websocket'],
    });

    socketIO.on('connect', () => {
      socketIO.emit('userId', this.state.userId);
    });

    socketIO.on('reloading', () => {
      this.onRefresh();
      // const { notificationMessage, title } = notification;
      // this.setState({ notificationMessage, title });
    });

    socketIO.on('triggerQr', (data) => {
      this.setState({ isModalVisible: false });
      if (data.qr && this.state.userId != 0) {
        this.props.navigation.navigate('QrSitter', {
          qrData: data.qr,
          userId: this.state.userId,
        });
      }
    });

    socketIO.on('pushNotification', (data) => {
      console.log(
        'babysitter got notification from socket ----------------',
        data,
      );
      if (data.title == 'Yêu cầu trong trẻ đã bị hủy') {
        console.log('yeu cau tron trer bi huy roi');
        this.props.navigation.navigate('Home');
      }
      this.handleSocketNotification(data);
    });
  }

  async componentDidUpdate(prevProps) {
    const { userId } = this.state;
    // console.log('PHUC: componentDidUpdate -> data', data);
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        const requestBody = {
          id: userId,
        };
        if (userId != 0) {
          //   registerPushNotifications(requestBody.id).then((response) => {
          //     if (response) {
          //       console.log('PHUC: App -> response', response.data);
          //     }
          //   });
        }
        await this.getInvitationData();
      }
    }
  }

  getRequestData = async () => {
    const { userId } = this.state;
    getRequestData(userId).then((res) => {
      if (res.data) {
        console.log(res.data);
        // this.setState({
        //   UpcomingInvitation: res.data,
        // });
      }
    });
  };

  getInvitationData = async () => {
    // get data for the babysitter (invitations)
    const { userId } = this.state;
    const requestBody = {
      id: userId,
    };
    this.setState({ loading: true });
    // await registerPushNotifications(userId);

    await Api.post('invitations/sitterInvitation', requestBody)
      .then((invitations) => {
        invitations.sort((a, b) => this.compareInviteByDate(a, b));

        const invitationsPending = invitations.filter(
          (invitation) => invitation.status == 'PENDING',
        );

        const invitationsWaiting = invitations.filter(
          (invitation) => invitation.status == 'ACCEPTED',
        );

        const invitationsUpcoming = invitations.filter(
          (invitation) =>
            (invitation.sittingRequest.status == 'CONFIRMED' ||
              invitation.sittingRequest.status == 'ONGOING') &&
            invitation.sittingRequest.acceptedBabysitter == userId,
        );

        const ongoingInvitation = invitations.filter(
          (invitation) =>
            invitation.sittingRequest.status == 'ONGOING' &&
            invitation.sittingRequest.acceptedBabysitter == userId,
        );
        // console.log(
        //   'PHUC: SitterHomeScreen -> getInvitationData -> ongoingInvitation',
        //   ongoingInvitation[0],
        // );

        // console.log(
        //   'PHUC: SitterHomeScreen -> getInvitationData -> ongoingInvitation',
        //   ongoingInvitation[0].sittingRequest.user.image,
        // );

        if (ongoingInvitation && ongoingInvitation.length > 0) {
          this.setState({
            invitationsPending,
            //            invitationsUpcoming,
            invitationsWaiting,
            ongoingInvitation: ongoingInvitation[0],
            ongoingParent: ongoingInvitation[0].sittingRequest.user.image,
            isModalVisible: true,
            loading: false,
          });
        } else {
          this.setState({
            invitationsPending,
            invitationsUpcoming,
            invitationsWaiting,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  toggleModalOngoing = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  confirmModalPopup = () => {
    const { invitationId } = this.state;
    this.props.navigation.push('InvitationDetail', {
      invitationId: invitationId,
    });
    this.AlertPro.close();
  };

  handleSocketNotification = async (notification) => {
    await this.onRefresh();

    if (notification) {
      const { id, message, title, option } = notification;
      this.setState(
        {
          notificationMessage: message,
          title: title,
          showConfirm: option.showConfirm,
          showCancel: option.showCancel,
          textCancel: option.textCancel,
          textConfirm: option.textConfirm,
          invitationId: id,
        },
        () => {
          this.refs.toast.show(notification.message, DURATION.LENGTH_LONG);
          this.AlertPro.open();
        },
      );
    }
  };

  handleNotification = async (notification) => {
    const { origin, data } = notification;
    const { message, title, option, id } = data;
    this.onRefresh();
    if (origin == 'received') {
      this.setState(
        {
          notification: notification,
          notificationMessage: message,
          title: title,
          showConfirm: option.showConfirm,
          showCancel: option.showCancel,
          textCancel: option.textCancel,
          textConfirm: option.textConfirm,
          invitationId: id,
        },
        () => {
          this.AlertPro.open();
          this.refs.toast.show(notification.data.message, DURATION.LENGTH_LONG);
        },
      );
    } else {
      this.setState(
        {
          notification: notification,
          notificationMessage: message,
          title: title,
          showConfirm: option.showConfirm,
          showCancel: option.showCancel,
          textCancel: option.textCancel,
          textConfirm: option.textConfirm,
          invitationId: id,
        },
        () => {
          const { notification } = this.state;
          this.props.navigation.push('InvitationDetail', {
            invitationId: notification.data.id,
          });
          this.refs.toast.show(notification.data.message, DURATION.LENGTH_LONG);
        },
      );
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getInvitationData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  compareInviteByDate = (a, b) => {
    const aTime = moment(
      `${a.sittingRequest.sittingDate} ${a.sittingRequest.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');
    const bTime = moment(
      `${b.sittingRequest.sittingDate} ${b.sittingRequest.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');

    return aTime > bTime;
  };

  compareResquestByDate = (a, b) => {
    const aTime = moment(
      `${a.sittingDate} ${a.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');
    const bTime = moment(
      `${b.sittingDate} ${b.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');

    return aTime > bTime;
  };

  render() {
    const {
      invitationsPending,
      invitationsUpcoming,
      invitationsWaiting,
      refreshing,
      title,
      notificationMessage,
      loading,
      showCancel,
      showConfirm,
      textCancel,
      textConfirm,
      index,
      routes,
    } = this.state;
    const {
      containerBsitter,
      textBsitter,
      scheduleContainerBsitter,
      noRequest,
      noRequestText,
      noRequestImage,
      horizontalUpcoming,
    } = styles;

    const InvitationPending = () => (
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          data={invitationsPending}
          renderItem={({ item }) => <PendingInvitation invitation={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={noRequest}>
              <MuliText style={noRequestText}>
                Hiện tại bạn không có lời mời nào
              </MuliText>
              <Image
                source={require('assets/images/no-pending.png')}
                style={noRequestImage}
              />
            </View>
          }
        />
      </View>
    );

    const InvitationWaiting = () => (
      <View style={{ flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          data={invitationsWaiting}
          renderItem={({ item }) => <WaitingInvitation invitation={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={noRequest}>
              <MuliText style={noRequestText}>
                Bạn không có lời mời nào đang chờ chấp nhận
              </MuliText>
              <Image
                source={require('assets/images/no-waiting.png')}
                style={noRequestImage}
              />
            </View>
          }
        />
      </View>
    );

    return (
      <View style={containerBsitter}>
        {/* <TouchableOpacity
          onPress={() => {
            this.toggleModalOngoing();
          }}
        >
          <MuliText style={styles.textParentRequest}>
            nhan vao day de ongoing
          </MuliText>
        </TouchableOpacity> */}
        <Loader loading={loading} />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.confirmModalPopup()}
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
        <Toast
          ref="toast"
          position="top"
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          hasBackdrop={true}
          backdropOpacity={0.9}
          backdropColor="gray"
          onBackButtonPress={() => this.toggleModalOngoing()}
          onBackdropPress={() => this.toggleModalOngoing()}
          style={{ margin: 0, justifyContent: 'flex-end' }}
        >
          <View
            style={{
              flex: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            {this.state.ongoingInvitation && (
              <View
                style={{
                  flex: 1,
                  width: width,
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}
              >
                <View>
                  <MuliText>Trạng Thái</MuliText>
                  <MuliText style={{ color: colors.ongoing, fontSize: 20 }}>
                    {this.state.ongoingInvitation.sittingRequest.status &&
                      'Đang thực hiện'}
                  </MuliText>
                </View>
                <View style={{ marginTop: 20 }}>
                  <MuliText>Thực hiện trông trẻ cho</MuliText>
                </View>
                <View style={styles.detailContainer}>
                  <View style={styles.detailPictureContainer}>
                    <Image
                      source={{
                        uri: this.state.ongoingParent,
                      }}
                      style={styles.profileImg}
                    />
                    <View style={styles.leftInformation}>
                      <MuliText style={{ color: colors.gray, fontSize: 14 }}>
                        Phụ huynh
                      </MuliText>
                      <MuliText style={{ fontSize: 15 }}>
                        {
                          this.state.ongoingInvitation.sittingRequest.user
                            .nickname
                        }
                      </MuliText>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 20 }}>
                  <MuliText>Địa chỉ</MuliText>
                  <MuliText style={{ fontSize: 14, marginHorizontal: 20 }}>
                    {this.state.ongoingInvitation.sittingRequest.sittingAddress}
                  </MuliText>
                </View>
              </View>
            )}
          </View>
        </Modal>
        <View style={scheduleContainerBsitter}>
          <MuliText style={textBsitter}>Lịch giữ trẻ của bạn</MuliText>
        </View>
        {invitationsUpcoming != null && invitationsUpcoming.length > 0 ? (
          <View style={horizontalUpcoming}>
            <MuliText style={{ marginHorizontal: 15 }}>
              Lịch giữ trẻ sắp tới
            </MuliText>
            <View style={{ flex: 1 }}>
              <FlatList
                horizontal={true}
                data={invitationsUpcoming}
                renderItem={({ item }) => (
                  <UpcomingInvitation invitation={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </View>
        ) : null}
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            Pending: InvitationPending,
            Waiting: InvitationWaiting,
          })}
          onIndexChange={(index) => this.setState({ index })}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: colors.white }}
              style={{
                backgroundColor: colors.darkGreenTitle,
              }}
            />
          )}
        />
      </View>
    );
  }
}

export default withNavigationFocus(SitterHomeScreen);

SitterHomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  containerBsitter: {
    flex: 1,
    backgroundColor: colors.homeColor,
  },
  textBsitter: {
    marginTop: 15,
    fontSize: 14,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
    lineHeight: 15,
    alignItems: 'flex-start',
  },
  noRequest: {
    height: (4 * height) / 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 25,
    paddingTop: 15,
    fontSize: 13,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
  },
  noRequestImage: {
    marginTop: 60,
    width: 290,
    height: 230,
  },
  scheduleContainerBsitter: {
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    padding: 30,
    backgroundColor: colors.white,
    height: 100,
  },
  horizontalUpcoming: {
    height: 200,
    backgroundColor: 'white',
  },
  textParentRequest: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 1,
    color: colors.gray,
  },

  detailContainer: {
    marginVertical: 15,
  },
  detailPictureContainer: {
    flexDirection: 'row',
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  leftInformation: {
    marginTop: 5,
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
});
