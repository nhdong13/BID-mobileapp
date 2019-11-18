/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { MuliText } from 'components/StyledText';
import { getRequests } from 'api/sittingRequest.api';
import { withNavigationFocus } from 'react-navigation';
// import Loader from 'utils/Loader';
import ParentRequest from 'screens/parent/ParentRequest';
import colors from 'assets/Color';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { Notifications } from 'expo';
import AlertPro from 'react-native-alert-pro';
import CalendarStrip from 'react-native-calendar-strip';
import registerPushNotifications from 'utils/Notification';
import { markDates } from 'utils/markedDates';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';
import Loader from 'utils/Loader';

moment.locale('vi', localization);

class ParentHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      sittingDates: [],
      userId: 0,
      roleId: 0,
      refreshing: false,
      agenda: 0,
      notification: [],
      notificationMessage: '',
      title: '',
      loading: false,
      selectedDateRequest: [],
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    await this.getRequestData();
    this.onSelectedDate();
    this._notificationSubscription = Notifications.addListener(
      this.handleNotification,
    );

    const socketIO = io(apiUrl.socket, {
      transports: ['websocket'],
    });

    socketIO.on('connect', () => {
      socketIO.emit('userId', this.state.userId);
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        await this.getRequestData();
        this.onSelectedDate();
      }
    }
  }

  handleNotification = (notification) => {
    const { origin } = notification;
    if (origin == 'received') {
      this.setState(
        {
          notification: notification,
          notificationMessage: notification.data.message,
          title: notification.data.title,
        },
        () => {
          this.refs.toast.show(notification.data.message, DURATION.LENGTH_LONG);
          this.AlertPro.open();
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
          this.refs.toast.show(notification.data.message, DURATION.LENGTH_LONG);
          this.props.navigation.push('RequestDetail', {
            requestId: notification.data.id,
          });
        },
      );
    }
  };

  confirmModalPopup = () => {
    const { notification } = this.state;
    this.props.navigation.push('RequestDetail', {
      requestId: notification.data.id,
    });
    this.AlertPro.close();
  };

  getRequestData = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
      registerPushNotifications(userId);
    });
    if (this.state.roleId != 0) {
      await getRequests(this.state.userId)
        .then((res) => {
          const markedDates = markDates(res);
          this.setState({
            requests: res,
            sittingDates: markedDates,
            loading: false,
          });
        })
        .catch((error) =>
          console.log('HomeScreen - getRequestData - Requests ' + error),
        );
    } else console.log('Something went wrong -- RoleId not found');
  };

  _onRefresh = () => {
    this.setState({ loading: true });
    this.getRequestData().then(() => {
      // this.setState({ refreshing: false });
    });
  };

  onSelectedDate = (date = moment().format('YYYY-MM-DD')) => {
    const { requests } = this.state;

    if (requests.length > 0) {
      const selectedDateRequest = requests.filter(
        (request) =>
          request.sittingDate == date &&
          (request.status != 'DONE' && request.status != 'CANCELED'),
      );
      console.log(
        'PHUC: ParentHomeScreen -> onSelectedDate -> selectedDateRequest',
        selectedDateRequest,
      );

      if (selectedDateRequest.length > 0) {
        this.setState({ selectedDateRequest });
      } else {
        console.log('ko co record nao ca');
        this.setState({ selectedDateRequest });
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      refreshing,
      notificationMessage,
      title,
      selectedDateRequest,
    } = this.state;

    const {
      container,
      textParent,
      scheduleContainer,
      noRequest,
      noRequestText,
      noRequestImage,
    } = styles;
    return (
      <View key={this.state.agenda} style={container}>
        <Toast ref="toast" position="top" />
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
        <View style={scheduleContainer}>
          <MuliText style={textParent}>Khi nào bạn cần người giữ trẻ?</MuliText>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateRequest')}
          >
            <MuliText style={styles.textParentRequest}>
              Nhấn vào đây để tạo yêu cầu
            </MuliText>
          </TouchableOpacity>
        </View>
        <CalendarStrip
          markedDates={
            this.state.sittingDates.length > 0 ? this.state.sittingDates : []
          }
          calendarAnimation={{
            type: 'sequence',
            duration: 30,
            fontFamily: 'muli',
          }}
          innerStyle={{ fontFamily: 'muli' }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: '#1edcb7',
          }}
          style={{
            flex: 0.2,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          calendarHeaderStyle={{
            color: '#527395',
            marginBottom: 20,
          }}
          calendarColor="white"
          dateNumberStyle={{
            color: '#315f61',
            fontFamily: 'muli',
            fontSize: 13,
          }}
          dateNameStyle={{ color: '#95a5a6', fontFamily: 'muli' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateNameStyle={{ color: 'white' }}
          disabledDateNameStyle={{ color: '#bdc3c7' }}
          disabledDateNumberStyle={{ color: '#bdc3c7' }}
          weekendDateNameStyle={{ color: '#e74c3c', fontFamily: 'muli' }}
          weekendDateNumberStyle={{ color: '#bdc3c7', fontFamily: 'muli' }}
          iconContainer={{ flex: 0.1 }}
          onDateSelected={(date) =>
            this.onSelectedDate(date.format('YYYY-MM-DD'))
          }
        />
        <View style={{ flex: 1 }}>
          {selectedDateRequest != '' && selectedDateRequest ? (
            <FlatList
              data={selectedDateRequest}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              renderItem={({ item }) => <ParentRequest request={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View style={noRequest}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateRequest')}
                >
                  <View style={noRequest}>
                    <MuliText style={noRequestText}>
                      Bạn không có yêu cầu nào cho ngày này
                    </MuliText>
                    <View
                      style={{
                        paddingHorizontal: 10,
                      }}
                    >
                      <MuliText style={styles.textParentRequest}>
                        Nhấn vào đây để tạo yêu cầu
                      </MuliText>
                    </View>
                    <Image
                      source={require('assets/images/no-request.jpg')}
                      style={noRequestImage}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default withNavigationFocus(ParentHomeScreen);

ParentHomeScreen.navigationOptions = {
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
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 1,
    color: colors.gray,
  },
  textBsitterRequest: {
    color: colors.gray,
  },
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
    marginTop: 15,
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  noRequestText: {
    marginVertical: 10,
    paddingTop: 10,
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
