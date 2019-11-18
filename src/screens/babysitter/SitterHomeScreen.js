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

    socketIO.on('triggerQr', (data) => {
      if (data.qr && this.state.userId != 0) {
        this.props.navigation.navigate('QrSitter', {
          qrData: data.qr,
          userId: this.state.userId,
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
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

        Api.post('invitations/sitterInvitation', requestBody)
          .then((res) => {
            this.setState({ invitations: res });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Invitations ' + error,
            ),
          );
      }
    }
  }

  getInvitationData = async () => {
    // get data for the babysitter (invitations)
    const requestBody = {
      id: this.state.userId,
    };
    registerPushNotifications(requestBody.id).then((response) => {
      if (response) {
        console.log('PHUC: App -> response', response.data);
      }
    });
    await Api.post('invitations/sitterInvitation', requestBody)
      .then((invitations) => {
        const invitationsPending = invitations.filter(
          (invitation) => invitation.status == 'PENDING',
        );

        const invitationsWaiting = invitations.filter(
          (invitation) => invitation.status == 'ACCEPTED',
        );

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
      <View style={{ alignItems: 'center', flex: 0.8 }}>
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
                source={require('assets/images/no-request.jpg')}
                style={noRequestImage}
              />
            </View>
          }
        />
      </View>
    );

    const InvitationWaiting = () => (
      <View>
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
                Hiện tại bạn không có lời mời nào
              </MuliText>
              <Image
                source={require('assets/images/no-request.jpg')}
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
              backgroundColor: '#e74c3c',
            },
            buttonConfirm: {
              backgroundColor: '#4da6ff',
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
            <MuliText>Upcoming sittings</MuliText>
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
              style={{ backgroundColor: colors.darkGreenTitle }}
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
  borderText: {
    borderRadius: 1,
    borderColor: colors.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  textParentRequest: {
    color: colors.gray,
  },
  textBsitterRequest: {
    color: colors.gray,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBsitter: {
    flex: 1,
    backgroundColor: '#dfe6e9',
  },
  textParent: {
    marginTop: 15,
    fontSize: 19,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  textBsitter: {
    marginTop: 15,
    fontSize: 14,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 15,
    alignItems: 'flex-start',
  },
  noRequest: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 25,
    paddingTop: 15,
    fontSize: 13,
    color: '#315f61',
    fontWeight: 'bold',
  },
  noRequestImage: {
    width: 150,
    height: 300,
    marginVertical: 20,
  },
  scheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingVertical: 15,
    marginBottom: 20,
    flex: 0.1,
    backgroundColor: '#fff',
  },
  scheduleContainerBsitter: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 15,
    paddingLeft: 30,
    backgroundColor: '#fff',
    height: 100,
  },
  date: {
    marginTop: 5,
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
    fontSize: 10,
  },
  horizontalUpcoming: {
    flex: 0.4,
    backgroundColor: 'white',
  },
});
