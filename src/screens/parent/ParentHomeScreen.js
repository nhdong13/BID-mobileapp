/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import { MuliText } from 'components/StyledText';
import { Agenda } from 'react-native-calendars';
import { getRequests } from 'api/sittingRequest.api';
import { withNavigationFocus } from 'react-navigation';
// import Loader from 'utils/Loader';
import ParentRequest from 'screens/parent/ParentRequest';
import colors from 'assets/Color';
import moment from 'moment';
import registerPushNotifications from 'utils/Notification';
import { Notifications } from 'expo';
import AlertPro from 'react-native-alert-pro';
// import ModalPushNotification from 'components/ModalPushNotification';

class ParentHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
      userId: 0,
      roleId: 0,
      refreshing: false,
      agenda: 0,
      // loading: false,
      notification: {},
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
      if (data.userId != 0 && data.roleId == 2) {
        await getRequests(data.userId)
          .then((res) => {
            // console.log('PHUC: componentDidUpdate -> res', res);
            this.setState({ requests: res }, () =>
              this.setState({
                agenda: Math.random(),
              }),
            );
          })

          .catch((error) =>
            console.log('HomeScreen - getRequestData - Requests ' + error),
          );
      }
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
          this.setState({ requests: res });
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
        <Toast
          ref="toast"
          position="top"
        />
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
          <MuliText style={textParent}>Khi nào bạn cần người giữ trẻ? test</MuliText>
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
        <Agenda
          items={requests}
          selected={new moment().format('YYYY-MM-DD')}
          pastScrollRange={1}
          futureScrollRange={1}
          renderItem={(request) => <ParentRequest request={request} />}
          rowHasChanged={(r1, r2) => r1.text != r2.text}
          renderDay={() => <View />}
          renderEmptyDate={() => <View />}
          renderKnob={() => (
            <View>
              <MuliText>tap here bro</MuliText>
            </View>
          )}
          renderEmptyData={() => (
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
                      // borderRadius: 1,
                      // borderColor: colors.gray,
                      // borderWidth: 1,
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
          )}
          hideKnob={false}
          theme={{
            textDayFontFamily: 'muli',
            textDayHeaderFontFamily: 'muli',
            textDayHeaderFontSize: 11,
          }}
          style={{}}
          onRefresh={() => {
            this.setState({ refreshing: true });
            this.getRequestData().then(() => {
              this.setState({ refreshing: false });
            });
          }}
          refreshing={refreshing}
        />
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
