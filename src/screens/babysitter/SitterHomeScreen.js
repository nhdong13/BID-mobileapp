/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  FlatList,
  // TouchableOpacity,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { MuliText } from 'components/StyledText';
import { withNavigationFocus } from 'react-navigation';
// import Loader from 'utils/Loader';
import SitterInvitation from 'screens/babysitter/SitterInvitation';
import colors from 'assets/Color';
import Api from 'api/api_helper';
import apiUrl from 'utils/Connection';
import { Notifications } from 'expo';
import AlertPro from 'react-native-alert-pro';
import Loader from 'utils/Loader';
import registerPushNotifications from 'utils/Notification';
import io from 'socket.io-client';
// import ModalPushNotification from 'components/ModalPushNotification';

class SitterHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitations: null,
      userId: 0,
      refreshing: false,
      // agenda: 0,
      loading: false,
      notification: {},
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
      this.props.navigation.navigate('QrSitter', { qrData: data.qr });
    });
  }

  componentDidUpdate(prevProps) {
    const data = this.state;
    // console.log('PHUC: componentDidUpdate -> data', data);
    if (prevProps.isFocused != this.props.isFocused) {
      const requestBody = {
        id: data.userId,
      };
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
      .then((res) => {
        this.setState({
          invitations: res,
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
    this.props.navigation.navigate('InvitationDetail', {
      invitationId: notification.data.id,
    });
    this.AlertPro.close();
  };

  handleNotification = (notification) => {
    const { origin } = notification;
    if (origin == 'received') {
      this._onRefresh();
      this.setState(
        {
          notification: notification,
          notificationMessage:
            'Status of your invitation has been updateed, Do you want to see?',
        },
        () => {
          // console.log('test notification bsitter: ' + this.state.notification);
          this.AlertPro.open();
          this.refs.toast.show(
            'Status of your invitation has been upadted',
            DURATION.LENGTH_LONG,
          );
        },
      );
    } else {
      this.setState({ notification: notification }, () => {
        const { notification } = this.state;
        this.props.navigation.navigate('InvitationDetail', {
          invitationId: notification.data.id,
        });
        this.refs.toast.show(
          'Status of your invitation has been upadted',
          DURATION.LENGTH_LONG,
        );
      });
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getInvitationData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const { invitations, refreshing } = this.state;
    const {
      containerBsitter,
      textBsitter,
      scheduleContainerBsitter,
      noRequest,
      noRequestText,
      noRequestImage,
    } = styles;
    return (
      <View style={containerBsitter}>
        <Loader loading={this.state.loading} />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.confirmModalPopup()}
          onCancel={() => this.AlertPro.close()}
          title="Request confirmation"
          message={this.state.notificationMessage}
          textCancel="No"
          textConfirm="Yes"
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
          <MuliText style={textBsitter}>Lịch giữ trẻ của bạn test</MuliText>
        </View>
        <View style={{ alignItems: 'center', flex: 0.8 }}>
          {invitations != '' && invitations ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              data={invitations}
              renderItem={({ item }) => <SitterInvitation invitation={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View style={noRequest}>
              <MuliText style={noRequestText}>
                Hiện tại bạn không có yêu cầu nào
              </MuliText>
              <Image
                source={require('assets/images/no-request.jpg')}
                style={noRequestImage}
              />
            </View>
          )}
        </View>
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
    marginTop: 20,
    fontSize: 19,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  textBsitter: {
    marginTop: 20,
    fontSize: 19,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
    alignItems: 'flex-start',
  },
  noRequest: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 30,
    paddingTop: 20,
    fontSize: 18,
    color: '#315f61',
    fontWeight: 'bold',
  },
  noRequestImage: {
    width: 261,
    height: 236,
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
    marginTop: 25,
    paddingLeft: 30,
    flex: 0.25,
    backgroundColor: '#fff',
  },
  date: {
    marginTop: 5,
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
