import React, { Component } from 'react';
import { retrieveToken } from '../api/handleToken';
import {
  Button,
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ScrollView
} from 'react-native';

import { MuliText } from '../components/StyledText';
import { Agenda } from 'react-native-calendars';
import { getAllUsers } from '../api/getAllUsers';
import { getRequests } from '../api/getRequests';
import { getInvitations } from '../api/getInvitations';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
      invitations: null,
      userId: 0,
      roleId: 0,
      refreshing: false,
    }
  }

  // for user role of Parent - roleId == 2
  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId: userId, roleId: roleId })
    })

    if (this.state.roleId == 2) {
      await getRequests(this.state.userId).then(res => {
        this.setState({ requests: res })
      }).catch(error => console.log('HomeScreen - getDataAccordingToRole - Requests ' + error))
    } else {
      await getInvitations(this.state.userId).then(res => {
        this.setState({ invitations: res })
      }).catch(error => console.log('HomeScreen - getDataAccordingToRole - Invitations ' + error));
    }

  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getDataAccordingToRole().then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentWillMount() {
    this.getDataAccordingToRole();
  }

  render() {
    const { roleId, requests, invitations } = this.state;
    return (
      <View style={styles.container}>
        <View style={roleId == 2 ? styles.scheduleContainer : styles.scheduleContainerBsitter}>
          <MuliText style={roleId == 2 ? styles.textHeaderParent : styles.textHeaderBsitter}>{roleId && roleId == 2 ? 'When would you need a babysitter ?' : `Hi Sitter`}</MuliText>
          <TouchableOpacity>
            <MuliText>Welcome to bid :)</MuliText>
          </TouchableOpacity>
        </View>
        {roleId && roleId == 2 ? (<Agenda
          items={this.state.requests}
          selected={new moment().format("YYYY-MM-DD")}
          pastScrollRange={50}
          futureScrollRange={50}
          renderItem={(request) => {
            return (
              <TouchableOpacity onPress={() => this.props.navigation.navigate('RequestDetail', { requestId: request.id })}>
                <View style={styles.requestItem}>
                  <View style={styles.leftInformation}>
                    <MuliText style={styles.date}>{request.sittingDate}</MuliText>
                    <MuliText>{request.startTime} - {request.endTime}</MuliText>
                    <MuliText>{request.sittingAddress}</MuliText>
                  </View>
                  <View style={styles.rightInformation}>
                    {request.status == 'PENDING' ?
                      (
                        <View style={styles.statusBoxPending}>
                          <MuliText style={{ fontWeight: '800', color: 'gray' }}>{request.status}</MuliText>
                        </View>
                      )
                      :
                      (
                        <View style={styles.statusBoxConfirm}>
                          <MuliText style={{ fontWeight: '100', color: 'red' }}>{request.status}</MuliText>
                        </View>
                      )
                    }
                    <MuliText>$100</MuliText>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
          renderDay={(day, request) => { return (<View />); }}
          renderEmptyDate={() => (<View />)}
          renderEmptyData={() =>
            (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                <View style={styles.noRequest}>
                  <MuliText style={styles.noRequestText}>You don't have any request for now</MuliText>
                  <MuliText>Tap to create one</MuliText>
                  <Image
                    source={
                      require('../assets/images/no-request.jpg')
                    }
                    style={styles.noRequestImage}
                  />
                </View>
              </ScrollView>
            )
          }
          hideKnob={false}
          theme={{
            textDayFontFamily: 'muli',
            textDayHeaderFontFamily: 'muli',
            textDayHeaderFontSize: 11,
          }}
          style={{

          }}
          onRefresh={() => {
            this.setState({ refreshing: true });
            this.getRequests().then(() => {
              this.setState({ refreshing: false });
            });
          }}
          refreshing={this.state.refreshing}
        />
        ) : (
            <View style={{ alignItems: 'center' }}>
              {invitations != '' && invitations ?
                <ScrollView>
                  <TouchableOpacity style={{ backgroundColor: '#fff', marginTop: 20, marginHorizontal: 20, borderRadius: 20 }} onPress={() => this.props.navigation.navigate('InvitationDetail')}>
                    <View style={{ height: 135 }}>
                      <View style={{ flex: 0.2, backgroundColor: '#78ddb6', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                      </View>
                      <View style={{ flex: 0.8, width: 350, height: 150, flexDirection: 'row' }}>
                        <View style={styles.leftInformation}>
                          <MuliText style={styles.date}>2019-10-15</MuliText>
                          <MuliText>03:00 PM - 05:00 PM</MuliText>
                          <MuliText>529 Lê Đức Thọ, Phường 16, Gò Vấp, Hồ Chí Minh, Vietnam</MuliText>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                          <View style={styles.statusBoxConfirm}>
                            <MuliText style={{ fontWeight: '100', color: 'red' }}>DONE</MuliText>
                          </View>
                          <MuliText>$100</MuliText>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </ScrollView> : <MuliText>lele ko co gi het</MuliText>}

            </View>
          )
        }

        {
          roleId == 2 ? (<Button style={styles.createRequest} title="+" onPress={() => this.props.navigation.navigate('CreateRequest')} />) : (<View></View>)
        }
      </View>
    );
  }
}

export default HomeScreen;

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  createRequest: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ee6e73',
    position: 'absolute',
    opacity: 0.9,
    bottom: 10,
    right: 10,
  },
  textHeaderParent: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20
  },
  textHeaderBsitter: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
    alignItems: 'flex-start'
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
    width: 90,
    height: 40,
    padding: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: 360,
    height: 250,
  },
  noRequest: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    marginVertical: 20
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 120,
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
  },
  leftInformation: {
    // backgroundColor: 'blue',
    margin: 15,
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
    marginTop: 30,
    paddingTop: 20,
    marginBottom: 20,
    flex: 0.1,
  },
  scheduleContainerBsitter: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    paddingLeft: 30,
    flex: 0.25,
    // borderBottomWidth: 1,
    // borderBottomColor: '#315f61',
    // borderBottomRightRadius: 50,
    // borderBottomLeftRadius: 50,
    backgroundColor: '#fff'

  },
});
