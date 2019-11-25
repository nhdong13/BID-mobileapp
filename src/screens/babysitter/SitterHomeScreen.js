/* eslint-disable react/no-unused-state */
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
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Toast, { DURATION } from 'react-native-easy-toast';
import { MuliText } from 'components/StyledText';
import { withNavigationFocus } from 'react-navigation';
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

const { height } = Dimensions.get('window');

moment.updateLocale('vi', localization);

class SitterHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationsPending: null,
      invitationsUpcoming: null,
      invitationsWaiting: null,
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
    };
  }

  async componentDidMount() {
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
      this._notificationSubscription = Notifications.addListener(
        this.handleNotification,
      );
    });
    await this.getInvitationData();

    const socketIO = io(apiUrl.socket, {
      transports: ['websocket'],
    });

    socketIO.on('connect', () => {
      socketIO.emit('userId', this.state.userId);
    });

    socketIO.on('reloading', (notification) => {
      this._onRefresh();
      // const { notificationMessage, title } = notification;
      // this.setState({ notificationMessage, title });
    });

    socketIO.on('triggerQr', (data) => {
      if (data.qr && this.state.userId != 0) {
        this.props.navigation.navigate('QrSitter', {
          qrData: data.qr,
          userId: this.state.userId,
        });
      }
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
          registerPushNotifications(requestBody.id).then((response) => {
            if (response) {
              console.log('PHUC: App -> response', response.data);
            }
          });
        }
        await this.getInvitationData();
      }
    }
  }

  getInvitationData = async () => {
    // get data for the babysitter (invitations)
    const requestBody = {
      id: this.state.userId,
    };
    registerPushNotifications(requestBody.id).then((response) => {
      // if (response) {
      //   console.log('PHUC: App -> response', response.data);
      // }
    });
    await Api.post('invitations/sitterInvitation', requestBody)
      .then((invitations) => {
        invitations.sort((a, b) => this.compareInviteByDate(a, b));

        const invitationsPending = invitations.filter(
          (invitation) => invitation.status == 'PENDING',
        );

        const invitationsWaiting = invitations.filter(
          (invitation) => invitation.status == 'ACCEPTED',
        );
        // console.log(
        //   'PHUC: SitterHomeScreen -> getInvitationData -> invitationsWaiting',
        //   invitationsWaiting,
        // );

        const invitationsUpcoming = invitations.filter(
          (invitation) => invitation.status == 'CONFIRMED',
        );

        this.setState({
          invitationsPending,
          invitationsUpcoming,
          invitationsWaiting,
        });
      })
      .catch((error) =>
        console.log(
          'HomeScreen - getDataAccordingToRole - Invitations ' + error,
        ),
      );
  };

  confirmModalPopup = () => {
    const { notification } = this.state;
    // console.log('PHUC: confirmModalPopup -> notification', notification);
    this.props.navigation.push('InvitationDetail', {
      invitationId: notification.data.id,
    });
    this.AlertPro.close();
  };

  handleNotification = (notification) => {
    console.log(
      'PHUC: SitterHomeScreen -> handleNotification -> notification',
      notification,
    );
    const { origin } = notification;
    if (origin == 'received') {
      this._onRefresh();
      this.setState(
        {
          notification: notification,
          notificationMessage: notification.data.message,
          title: notification.data.title,
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
          notificationMessage: notification.data.message,
          title: notification.data.title,
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

  _onRefresh = () => {
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

  render() {
    const {
      invitationsPending,
      invitationsUpcoming,
      invitationsWaiting,
      refreshing,
      title,
      notificationMessage,
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
              onRefresh={this._onRefresh}
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
              onRefresh={this._onRefresh}
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
        <Loader loading={this.state.loading} />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.confirmModalPopup()}
          onCancel={() => this.AlertPro.close()}
          title={title}
          message={notificationMessage}
          textCancel="Không"
          textConfirm="Có"
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
          navigationState={this.state}
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
});
