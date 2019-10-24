/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { Agenda } from 'react-native-calendars';
import { getRequests } from 'api/sittingRequest.api';
import { withNavigationFocus } from 'react-navigation';
// import Loader from 'utils/Loader';
import SitterHome from 'screens/babysitter/SitterHome';
import ParentHome from 'screens/parent/ParentHome';
import colors from 'assets/Color';
import moment from 'moment';
import Api from 'api/api_helper';
import registerPushNotifications from 'utils/Notification';
import { Notifications } from 'expo';
// import ModalPushNotification from 'components/ModalPushNotification';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
      invitations: null,
      userId: 0,
      roleId: 0,
      refreshing: false,
      agenda: 0,
      loading: false,
      notitfication: {},
      setVisible: false,
    };
  }

  componentWillMount() {
    this.getDataAccordingToRole();
  }

  componentDidMount() {
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
                setVisible: false,
              }),
            );
          })

          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Requests ' + error,
            ),
          );
      } else if (data.userId != 0 && data.roleId == 3) {
        const requestBody = {
          id: data.userId,
        };
        await Api.post('invitations/sitterInvitation', requestBody)
          .then((res) => {
            this.setState({ invitations: res, setVisible: false });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Invitations ' + error,
            ),
          );
      }
    }
  }

  handleNotification = (notification) => {
    const { roleId } = this.state;
    if (roleId == 2) {
      this.setState({ notification: notification }, () => {
        // const { notification } = this.state;
        // this.props.navigation.navigate('RequestDetail', {
        //   requestId: notification.data.id,
        // });
      });
      // this.confirmModalPopup();
    } else {
      this.setState({ notification: notification }, () => {
        const { notification } = this.state;
        this.props.navigation.navigate('InvitationDetail', {
          invitationId: notification.data.id,
        });
      });
    }
  };

  confirmModalPopup = () => {
    this.setState({ setVisible: !this.state.setVisible });
  };

  getDataAccordingToRole = async () => {
    // check role of user parent - 1, bsitter - 2
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId, setVisible: false });
      registerPushNotifications(userId).then((response) => {
        if (response) {
          console.log(
            'PHUC: HomeScreen -> getDataAccordingToRole -> res',
            response.data,
          );
        }
      });
    });

    // call api according to their role
    if (this.state.roleId != 0) {
      if (this.state.roleId == 2) {
        // get data for parent (requests)
        await getRequests(this.state.userId)
          .then((res) => {
            this.setState({ requests: res });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Requests ' + error,
            ),
          );
      } else {
        // get data for the babysitter (invitations)
        // this.setState({ loading: true });
        const requestBody = {
          id: this.state.userId,
        };
        await Api.post('invitations/sitterInvitation', requestBody)
          .then((res) => {
            this.setState({
              invitations: res,
              loading: false,
              setVisible: false,
            });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Invitations ' + error,
            ),
          );
      }
    } else console.log('Something went wrong -- RoleId not found');
  };

  _onRefresh = () => {
    // this.setState({ refreshing: true });
    this.getDataAccordingToRole().then(() => {
      // this.setState({ refreshing: false });
    });
  };

  render() {
    const { navigation } = this.props;
    const {
      roleId,
      requests,
      invitations,
      refreshing,
    } = this.state;
    const {
      textBsitterRequest,
      textParentRequest,
      container,
      containerBsitter,
      textParent,
      textBsitter,
      scheduleContainer,
      scheduleContainerBsitter,
      noRequest,
      noRequestText,
      noRequestImage,
    } = styles;
    return (
      <View
        key={this.state.agenda}
        style={roleId == 2 ? container : containerBsitter}
      >
        {/* <Loader loading={loading} /> */}

        {/* {setVisible == true && (
          <ModalPushNotification
            setVisible={setVisible}
            notification={notification}
          />
        )} */}

        <View
          style={roleId == 2 ? scheduleContainer : scheduleContainerBsitter}
        >
          <MuliText style={roleId == 2 ? textParent : textBsitter}>
            {roleId && roleId == 2
              ? 'Khi nào bạn cần người giữ trẻ?'
              : 'Chào bạn'}
          </MuliText>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate('CreateRequest')}
          >
            <View
              style={{
                borderRadius: 1,
                borderColor: colors.gray,
                borderWidth: 1,
                paddingHorizontal: 10,
              }}
            >
              <MuliText
                style={roleId == 2 ? textParentRequest : textBsitterRequest}
              >
                {roleId && roleId == 2
                  ? 'Nhấn vào đây để tạo yêu cầu nhé'
                  : 'Yêu cầu của phụ huynh sẽ được hiển thị ở đây'}
              </MuliText>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{ marginTop: 30, height: 50 }}
            onPress={() => this.confirmModalPopup()}
          >
            <MuliText
              style={roleId == 2 ? textParentRequest : textBsitterRequest}
            >
              {roleId && roleId == 2
                ? 'touch here to see some surprise'
                : 'Yêu cầu của phụ huynh sẽ được hiển thị ở đây'}
            </MuliText>
          </TouchableOpacity> */}
        </View>
        {roleId && roleId == 2 ? (
          <Agenda
            items={requests}
            selected={new moment().format('YYYY-MM-DD')}
            pastScrollRange={50}
            futureScrollRange={50}
            renderItem={(request) => <ParentHome request={request} />}
            rowHasChanged={(r1, r2) => r1.text != r2.text}
            renderDay={() => <View />}
            renderEmptyDate={() => <View />}
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
              this.getDataAccordingToRole().then(() => {
                this.setState({ refreshing: false });
              });
            }}
            refreshing={refreshing}
          />
        ) : (
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
                renderItem={({ item }) => <SitterHome invitation={item} />}
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
        )}
      </View>
    );
  }
}

export default withNavigationFocus(HomeScreen);

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
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
