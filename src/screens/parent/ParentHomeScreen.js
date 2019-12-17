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
import { markDates } from 'utils/markedDates';
import apiUrl from 'utils/Connection';
import io from 'socket.io-client';
import Loader from 'utils/Loader';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons/';

moment.updateLocale('vi', localization);

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
    width: 290,
    height: 230,
    marginVertical: 20,
  },
  scheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    backgroundColor: colors.white,
  },
  modalCreate: {
    flex: 3,
    height: 100,
    backgroundColor: 'white',
    marginVertical: 10,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 10,
  },
  headModalCreate: {
    flex: 1,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
});
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
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
      loading: false,
      selectedDateRequest: [],
      selectedDate: new moment().format('YYYY-MM-DD'),
      isModalVisible: false,
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

    console.log(
      'PHUC: ParentHomeScreen -> componentDidMount -> this.state.userId',
      this.state.userId,
    );
    socketIO.on('connect', () => {
      socketIO.emit('userId', this.state.userId);

      socketIO.on('pushNotification', (data) => {
        console.log(
          'parent got notification from socket -------------------------',
          data,
        );
      });
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        console.log('chay may lan day ');
        await this.getRequestData();
        this.onSelectedDate();
      }
    }
  }

  handleNotification = async (notification) => {
    await this.getRequestData().then(() => {
      // this.setState({ refreshing: false });
    });
    const { origin, data } = notification;
    const { message, title, option } = data;
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
          notificationMessage: message,
          title: title,
          showConfirm: option.showConfirm,
          showCancel: option.showCancel,
          textCancel: option.textCancel,
          textConfirm: option.textConfirm,
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

  toggleModalCreateRequest = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  confirmModalPopup = () => {
    const { notification } = this.state;
    this.props.navigation.push('RequestDetail', {
      requestId: notification.data.id,
    });
    this.AlertPro.close();
  };

  getRequestData = async () => {
    await retrieveToken().then(async (res) => {
      const { userId, roleId } = res;
      await this.setState({ userId, roleId });
      // registerPushNotifications(userId);
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
          (request.status == 'PENDING' ||
            request.status == 'CONFIRMED' ||
            request.status == 'ONGOING'),
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
      showConfirm,
      showCancel,
      textCancel,
      textConfirm,
      isModalVisible,
    } = this.state;

    const {
      container,
      textParent,
      scheduleContainer,
      noRequest,
      noRequestText,
      noRequestImage,
      modalCreate,
      headModalCreate,
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
        <Modal
          isVisible={isModalVisible}
          coverScreen={true}
          onBackButtonPress={() => this.toggleModalCreateRequest()}
          onBackdropPress={() => this.toggleModalCreateRequest()}
        >
          <View style={{ flex: 0.5 }}>
            <TouchableOpacity
              onPress={() => {
                this.toggleModalCreateRequest();
                navigation.navigate('CreateRequest', {
                  selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
                });
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={headModalCreate}>
                  <Feather
                    name="calendar"
                    size={40}
                    style={{ marginBottom: -5 }}
                    color={colors.white}
                  />
                </View>
                <View style={modalCreate}>
                  <MuliText>Tạo yêu cầu giữ trẻ theo ngày</MuliText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.toggleModalCreateRequest();
                navigation.navigate('SearchSitter', {
                  selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
                });
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={headModalCreate}>
                  <Feather
                    name="user-check"
                    size={40}
                    style={{ marginBottom: -5 }}
                    color={colors.white}
                  />
                </View>
                <View style={modalCreate}>
                  <MuliText>
                    Tạo yêu cầu với người giữ trẻ trong Vòng tròn tin tưởng
                  </MuliText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.toggleModalCreateRequest();
                // navigation.navigate('CreateRequest', {
                //   selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
                // });
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={headModalCreate}>
                  <Feather
                    name="repeat"
                    size={40}
                    style={{ marginBottom: -5 }}
                    color={colors.white}
                  />
                </View>
                <View style={modalCreate}>
                  <MuliText>Tạo yêu cầu giữ trẻ định kỳ</MuliText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={scheduleContainer}>
          <MuliText style={textParent}>Khi nào bạn cần người giữ trẻ?</MuliText>
          <TouchableOpacity
            onPress={() => {
              this.toggleModalCreateRequest();
            }}
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
                  onPress={() => {
                    this.toggleModalCreateRequest();
                  }}
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
