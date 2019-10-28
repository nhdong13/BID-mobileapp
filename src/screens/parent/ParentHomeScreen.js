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
// import { Agenda } from 'react-native-calendars';
import { getRequests } from 'api/sittingRequest.api';
import { withNavigationFocus } from 'react-navigation';
// import Loader from 'utils/Loader';
import ParentRequest from 'screens/parent/ParentRequest';
import colors from 'assets/Color';
import moment from 'moment';
import registerPushNotifications from 'utils/Notification';
import { Notifications } from 'expo';
import AlertPro from 'react-native-alert-pro';
import CalendarStrip from 'react-native-calendar-strip';
// import ModalPushNotification from 'components/ModalPushNotification';
import { markDates } from 'utils/markedDates'

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
    };
  }

  // componentWillMount() {
  //   this.getRequestData();
  // }

  async componentDidMount() {
    await this.getRequestData();
    this._notificationSubscription = Notifications.addListener(
      this.handleNotification,
    );
  }

  async componentDidUpdate(prevProps) {
    const data = this.state;
    // console.log('PHUC: componentDidUpdate -> data', data);
    if (prevProps.isFocused != this.props.isFocused) {
      await this.getRequestData();
    }
  }

  handleNotification = (notification) => {
    const { origin } = notification;
    if (origin == 'received') {
      this.setState(
        {
          notification: notification,
          notificationMessage:
            'Sitter had accepted your invitaion, Do you want to see?',
        },
        () => {
          this.refs.toast.show(
            'Status of your invitation has been upadted',
            DURATION.LENGTH_LONG,
          );
          // console.log('test notification: ' + this.state.notification);
          this.AlertPro.open();
        },
      );
      // this.confirmModalPopup();
    } else {
      this.setState({ notification: notification }, () => {
        const { notification } = this.state;
        this.refs.toast.show(
          'Babysitter had accepted your invitation',
          DURATION.LENGTH_LONG,
        );
        this.props.navigation.navigate('RequestDetail', {
          requestId: notification.data.id,
        });
      });
    }
  };

  confirmModalPopup = () => {
    const { notification } = this.state;
    // console.log('PHUC: confirmModalPopup -> notification', notification);
    this.props.navigation.navigate('RequestDetail', {
      requestId: notification.data.id,
    });
    this.AlertPro.close();
  };

  getRequestData = async () => {
    // check role of user parent - 1, bsitter - 2
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
      registerPushNotifications(userId).then((response) => {
        if (response) {
          console.log(
            'PHUC: HomeScreen -> registerPushNotifications -> response',
            response.data,
          );
        }
      });
    });

    // call api according to their role
    if (this.state.roleId != 0) {
      // get data for parent (requests)
      await getRequests(this.state.userId)
        .then((res) => {
          const markedDates = markDates(res);
          this.setState({ requests: res, sittingDates: markedDates });
        })
        .catch((error) =>
          console.log('HomeScreen - getRequestData - Requests ' + error),
        );
    } else console.log('Something went wrong -- RoleId not found');
  };

  _onRefresh = () => {
    // this.setState({ refreshing: true });
    this.getRequestData().then(() => {
      // this.setState({ refreshing: false });
    });
  };

  render() {
    const { navigation } = this.props;
    const { requests, refreshing } = this.state;

    const {
      borderText,
      textParentRequest,
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
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.confirmModalPopup()}
          onCancel={() => this.AlertPro.close()}
          title="Request confirmation"
          message={this.state.notificationMessage}
          textCancel="Cancel"
          textConfirm="Accept"
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
          <MuliText style={textParent}>
            Khi nào bạn cần người giữ trẻ? test
          </MuliText>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate('CreateRequest')}
          >
            <View style={borderText}>
              <MuliText style={textParentRequest}>
                Nhấn vào đây để tạo yêu cầu nhé
              </MuliText>
            </View>
          </TouchableOpacity>
        </View>
        <CalendarStrip
          markedDates={this.state.sittingDates.length > 0 ? this.state.sittingDates : [] }
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
            marginBottom: 10,
          }}
          calendarHeaderStyle={{
            color: '#527395',
            marginBottom: 20,
          }}
          calendarColor="white"
          dateNumberStyle={{ color: '#315f61', fontFamily: 'muli', fontSize: 13 }}
          dateNameStyle={{ color: '#95a5a6', fontFamily: 'muli' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateNameStyle={{ color: 'white' }}
          disabledDateNameStyle={{ color: '#bdc3c7' }}
          disabledDateNumberStyle={{ color: '#bdc3c7' }}
          weekendDateNameStyle={{ color: '#e74c3c', fontFamily: 'muli' }}
          weekendDateNumberStyle={{ color: '#bdc3c7', fontFamily: 'muli' }}
          iconContainer={{ flex: 0.1 }}
          onDateSelected={(date) =>
            this.props.navigation.navigate('CreateRequest', {
              selectedDate: moment(date).format('YYYY-MM-DD'),
            })
          }
        />
        <View style={{ flex: 1 }}>
          {requests != '' && requests ? (
            <FlatList
              data={requests}
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
                  style={{ marginTop: 20 }}
                  onPress={() => navigation.navigate('CreateRequest')}
                >
                  <View style={noRequest}>
                    <MuliText style={noRequestText}>
                      Hiện tại bạn không có yêu cầu nào
                    </MuliText>
                    <View
                      style={{
                        paddingHorizontal: 10,
                      }}
                    >
                      <MuliText style={styles.textParentRequest}>
                        Nhấn vào đây để tạo yêu cầu nhé
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
