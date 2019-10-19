import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { Agenda } from 'react-native-calendars';
import { getRequests } from 'api/getRequests';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigationFocus } from 'react-navigation';
import Loader from 'utils/Loader';
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
    if (prevProps.isFocused != this.props.isFocused) {
      this.setState({ loading: true });
      if (data.userId != 0 && data.roleId == 2) {
        await getRequests(data.userId)
          .then((res) => {
            this.setState({ requests: res }, () =>
              this.setState({ agenda: Math.random(), loading: false })
            );
          })

          .catch((error) =>
            console.log(
              'HomeScreen - getDataAccordingToRole - Requests ' + error
            )
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
              'HomeScreen - getDataAccordingToRole - Invitations ' + error
            )
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
              'HomeScreen - getDataAccordingToRole - Requests ' + error
            )
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
              'HomeScreen - getDataAccordingToRole - Invitations ' + error
            )
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
    const { roleId, requests, invitations } = this.state;
    return (
      <View
        key={this.state.agenda}
        style={roleId == 2 ? styles.container : styles.containerBsitter}
      >
        <Loader loading={this.state.loading} />
        <View
          style={
            roleId == 2
              ? styles.scheduleContainer
              : styles.scheduleContainerBsitter
          }
        >
          <MuliText
            style={
              roleId == 2 ? styles.textHeaderParent : styles.textHeaderBsitter
            }
          >
            {roleId && roleId == 2
              ? 'When would you need a babysitter ?'
              : 'Hi Sitter'}
          </MuliText>
          <TouchableOpacity>
            <MuliText>Welcome to bid :)</MuliText>
          </TouchableOpacity>
        </View>
        {roleId && roleId == 2 ? (
          <Agenda
            items={requests}
            selected={new moment().format('YYYY-MM-DD')}
            pastScrollRange={50}
            futureScrollRange={50}
            renderItem={(request) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('RequestDetail', {
                    requestId: request.id,
                  })
                }
              >
                <View style={styles.requestItem}>
                  <View style={styles.leftInformation}>
                    <MuliText style={styles.date}>
                      {moment(request.sittingDate).format('dddd Do MMMM')}
                    </MuliText>
                    <MuliText style={{ color: '#7edeb9' }}>
                      {moment.utc(request.startTime, 'HH:mm').format('HH:mm')} -
                      {moment.utc(request.endTime, 'HH:mm').format('HH:mm')}
                    </MuliText>
                    <MuliText style={{ marginTop: 10 }}>
                      {request.sittingAddress}
                    </MuliText>
                  </View>
                  <View style={styles.rightInformation}>
                    {request.status == 'PENDING' ? (
                      <View style={styles.statusBoxPending}>
                        <MuliText style={{ fontWeight: '100', color: 'gray' }}>
                          {request.status}
                        </MuliText>
                      </View>
                    ) : (
                      <View style={styles.statusBoxConfirm}>
                        <MuliText
                          style={{
                            fontWeight: '100',
                            color: 'red',
                            fontSize: 13,
                          }}
                        >
                          {request.status}
                        </MuliText>
                      </View>
                    )}
                    <MuliText>$100</MuliText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            rowHasChanged={(r1, r2) => r1.text != r2.text}
            renderDay={() => <View />}
            renderEmptyDate={() => <View />}
            renderEmptyData={() => (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <View style={styles.noRequest}>
                  <MuliText style={styles.noRequestText}>
                    You don't have any request for now
                  </MuliText>
                  <MuliText>Tap New Sitting to create one</MuliText>
                  <Image
                    source={require('assets/images/no-request.jpg')}
                    style={styles.noRequestImage}
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
            refreshing={this.state.refreshing}
          />
        ) : (
          <View style={{ alignItems: 'center', flex: 0.8 }}>
            {invitations != '' && invitations ? (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                {invitations.map((invitation) => (
                  <TouchableOpacity
                    key={invitation.id}
                    style={{
                      backgroundColor: '#fff',
                      marginTop: 20,
                      marginHorizontal: 20,
                      borderRadius: 20,
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('InvitationDetail', {
                        invitationId: invitation.id,
                      })
                    }
                  >
                    <View style={styles.requestItemSitter}>
                      <View style={styles.leftInformationSitter}>
                        <MuliText style={styles.date}>
                          {moment(invitation.sittingRequest.sittingDate).format(
                            'dddd Do MMMM'
                          )}
                        </MuliText>
                        <MuliText>
                          Invitation from{' '}
                          {invitation.sittingRequest.user.nickname}
                        </MuliText>
                        <MuliText style={{ marginTop: 10, color: '#7edeb9' }}>
                          {moment
                            .utc(invitation.sittingRequest.startTime, 'HH:mm')
                            .format('HH:mm')}{' '}
                          -
                          {moment
                            .utc(invitation.sittingRequest.endTime, 'HH:mm')
                            .format('HH:mm')}
                        </MuliText>
                        <MuliText style={{ marginTop: 10 }}>
                          {invitation.sittingRequest.sittingAddress}
                        </MuliText>
                      </View>
                      <View style={styles.rightInformation}>
                        {invitation.status == 'PENDING' ? (
                          <View style={styles.statusBoxPending}>
                            <MuliText
                              style={{ fontWeight: '100', color: 'gray' }}
                            >
                              {invitation.status}
                            </MuliText>
                          </View>
                        ) : (
                          <View style={styles.statusBoxConfirm}>
                            <MuliText
                              style={{ fontWeight: '100', color: 'red' }}
                            >
                              {invitation.status}
                            </MuliText>
                          </View>
                        )}
                        <MuliText>$100</MuliText>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noRequest}>
                <MuliText style={styles.noRequestText}>
                  You don't have any request for now
                </MuliText>
                <MuliText>Tap to create one</MuliText>
                <Image
                  source={require('assets/images/no-request.jpg')}
                  style={styles.noRequestImage}
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
  createRequest: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    opacity: 0.9,
    bottom: 10,
    right: 10,
  },
  textHeaderParent: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  textHeaderBsitter: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
    alignItems: 'flex-start',
  },
  statusBoxPending: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 90,
    height: 40,
    padding: 10,
  },
  statusBoxConfirm: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 100,
    height: 50,
    padding: 5,
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
  requestItemSitter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 200,
    width: 350,
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 5,
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 180,
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  leftInformationSitter: {
    // backgroundColor: 'blue',
    marginLeft: 10,
    flex: 1,
  },
  leftInformation: {
    // backgroundColor: 'blue',
    margin: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  rightInformation: {
    // backgroundColor: 'green',
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
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
