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

moment.updateLocale('vi', localization);

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
      selectedDate: new moment().format('YYYY-MM-DD'),
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

  onSelectedDate = (
    date = moment(this.state.selectedDate).format('YYYY-MM-DD'),
  ) => {
    const { requests } = this.state;

    if (requests.length > 0) {
      const selectedDateRequest = requests.filter(
        (request) =>
          request.sittingDate == date &&
          (request.status != 'DONE' && request.status != 'CANCELED'),
      );
      selectedDateRequest.sort((a, b) => this.compareInviteByDate(a, b));
      this.setState({ selectedDateRequest });
    }
  };

  compareInviteByDate = (a, b) => {
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
    const { navigation } = this.props;
    const {
      refreshing,
      notificationMessage,
      title,
      selectedDateRequest,
      selectedDate,
      sittingDates,
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
              backgroundColor: colors.canceled,
            },
            buttonConfirm: {
              backgroundColor: colors.buttonConfirm,
            },
          }}
        />
        <View style={scheduleContainer}>
          <MuliText style={textParent}>Khi nào bạn cần người giữ trẻ?</MuliText>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CreateRequest', {
                selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
              })
            }
          >
            <MuliText style={styles.textParentRequest}>
              Nhấn vào đây để tạo yêu cầu
            </MuliText>
          </TouchableOpacity>
        </View>
        <CalendarStrip
          markedDates={sittingDates.length > 0 ? sittingDates : []}
          calendarAnimation={{
            type: 'sequence',
            duration: 30,
            fontFamily: 'muli',
          }}
          innerStyle={{ fontFamily: 'muli' }}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            highlightColor: colors.lightGreen,
          }}
          style={{
            flex: 0.2,
            paddingTop: 10,
            paddingBottom: 10,
          }}
          calendarHeaderStyle={{
            color: colors.calendarHeader,
            marginBottom: 20,
          }}
          calendarColor="white"
          dateNumberStyle={{
            color: colors.darkGreenTitle,
            fontFamily: 'muli',
            fontSize: 13,
          }}
          dateNameStyle={{ color: colors.dateName, fontFamily: 'muli' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateNameStyle={{ color: 'white' }}
          disabledDateNameStyle={{ color: colors.gray }}
          disabledDateNumberStyle={{ color: colors.gray }}
          weekendDateNameStyle={{ color: colors.canceled, fontFamily: 'muli' }}
          weekendDateNumberStyle={{ color: colors.gray, fontFamily: 'muli' }}
          iconContainer={{ flex: 0.1 }}
          onDateSelected={(date) => {
            this.onSelectedDate(date.format('YYYY-MM-DD'));
            this.setState({ selectedDate: date });
          }}
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
                  onPress={() =>
                    navigation.navigate('CreateRequest', {
                      selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
                    })
                  }
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
                      source={require('assets/images/search-request.png')}
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
  textParentRequest: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 1,
    color: colors.gray,
  },
  container: {
    flex: 1,
    backgroundColor: colors.homeColor,
  },
  textParent: {
    marginTop: 20,
    fontSize: 19,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
    lineHeight: 20,
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
    color: colors.darkGreenTitle,
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
    backgroundColor: colors.white,
  },
});
