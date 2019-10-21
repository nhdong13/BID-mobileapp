import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView,
  FlatList,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { Agenda } from 'react-native-calendars';
import { getRequests } from 'api/getRequests';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigationFocus } from 'react-navigation';
import Loader from 'utils/Loader';
import SitterHome from 'screens/babysitter/SitterHome';
import ParentHome from 'screens/parent/ParentHome';
import colors from 'assets/Color';
import moment from 'moment';
import Api from '../api/api_helper';

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
    };
  }

  componentWillMount() {
    this.getDataAccordingToRole();
  }

  async componentDidUpdate(prevProps) {
    const data = this.state;
    // console.log('PHUC: componentDidUpdate -> data', data);
    if (prevProps.isFocused != this.props.isFocused) {
      this.setState({ loading: true });
      if (data.userId != 0 && data.roleId == 2) {
        await getRequests(data.userId)
          .then((res) => {
            // console.log('PHUC: componentDidUpdate -> res', res);
            this.setState({ requests: res }, () =>
              this.setState({ agenda: Math.random(), loading: false }),
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
            this.setState({ invitations: res, loading: false });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Invitations ' + error,
            ),
          );
      }
    }
  }

  // for user role of Parent - roleId == 2
  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
    });

    if (this.state.roleId != 0) {
      if (this.state.roleId == 2) {
        this.setState({ loading: true });
        await getRequests(this.state.userId)
          .then((res) => {
            this.setState({ requests: res, loading: false });
          })
          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Requests ' + error,
            ),
          );
      } else {
        const requestBody = {
          id: this.state.userId,
        };
        await Api.post('invitations/sitterInvitation', requestBody)
          .then((res) => {
            this.setState({ invitations: res, loading: false });
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
    this.setState({ refreshing: true });
    this.getDataAccordingToRole().then(() => {
      this.setState({ refreshing: false });
    });
  };

  // componentWillUpdate(prevPr)

  render() {
    const { roleId, requests, invitations, loading, refreshing } = this.state;
    const {
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
        <Loader loading={loading} />
        <View
          style={roleId == 2 ? scheduleContainer : scheduleContainerBsitter}
        >
          <MuliText style={roleId == 2 ? textParent : textBsitter}>
            {roleId && roleId == 2
              ? 'Khi nào bạn cần người giữ trẻ?'
              : 'Chào bạn'}
          </MuliText>
          <TouchableOpacity>
            <MuliText>Chào mừng đến với BID:)</MuliText>
          </TouchableOpacity>
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
                <View style={noRequest}>
                  <MuliText style={noRequestText}>
                    Hiện tại bạn không có yêu cầu nào
                  </MuliText>
                  <MuliText>Nhấn vào đây để tạo yêu cầu</MuliText>
                  <Image
                    source={require('assets/images/no-request.jpg')}
                    style={noRequestImage}
                  />
                </View>
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
                <MuliText>Nhấn vào đây để tạo yêu cầu</MuliText>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerBsitter: {
    flex: 1,
    backgroundColor: '#dfe6e9',
  },
  textParent: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  textBsitter: {
    fontSize: 20,
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
    paddingVertical: 15,
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
