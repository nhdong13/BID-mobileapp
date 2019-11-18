/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import moment from 'moment';
import { formater } from 'utils/MoneyFormater';
import { getSitting } from '../../api/sittingRequest.api';

export default class SittingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
      invitations: null,
      userId: 0,
      refreshing: false,
    };
  }

  componentWillMount() {
    this.getDataAccordingToRole();
  }

  // for user role of Parent - roleId == 2
  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });

    const requestBody = {
      userId: this.state.userId,
      status: 'DONE',
    };
    const rp = await getSitting(requestBody).then((res) => {
      this.setState({ requests: res });
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getDataAccordingToRole().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const { requests } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          {requests != '' && requests ? (
            <ScrollView>
              {requests.map((request) => (
                <TouchableOpacity
                  key={request.id}
                  style={{
                    backgroundColor: '#fff',
                    marginTop: 20,
                    marginHorizontal: 20,
                    borderRadius: 20,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('Feedback', {
                      requestId: request.id,
                    })
                  }
                >
                  <View style={{ height: 135 }}>
                    <View
                      style={{
                        flex: 0.2,
                        backgroundColor: '#78ddb6',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    />
                    <View
                      style={{
                        flex: 0.8,
                        width: 350,
                        height: 150,
                        flexDirection: 'row',
                      }}
                    >
                      <View style={styles.leftInformation}>
                        <MuliText>Yêu cầu từ {request.user.nickname}</MuliText>
                        <MuliText style={styles.date}>
                          {moment(request.sittingDate).format('DD-MM-YYYY')}
                        </MuliText>
                        <MuliText>
                          {moment
                            .utc(request.startTime, 'HH:mm')
                            .format('HH:mm')}{' '}
                          -
                          {moment.utc(request.endTime, 'HH:mm').format('HH:mm')}
                        </MuliText>
                        <MuliText>{request.sittingAddress}</MuliText>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <View style={styles.statusBoxConfirm}>
                          <MuliText style={{ fontWeight: '100', color: 'red' }}>
                            {request.status}
                          </MuliText>
                        </View>
                        <MuliText>{formater(request.totalPrice)} VND</MuliText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noRequest}>
              <MuliText style={styles.noRequestText}>
                Hiện tại bạn không có yêu cầu nào
              </MuliText>
              <MuliText>Nhấn để tạo yêu cầu</MuliText>
              <Image
                source={require('assets/images/no-request.jpg')}
                style={styles.noRequestImage}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

SittingList.navigationOptions = {
  title: 'Yêu cầu giữ trẻ',
};

const styles = StyleSheet.create({
  container: {
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
    width: 90,
    height: 40,
    padding: 10,
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
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 25,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  scheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    marginBottom: 20,
    flex: 0.1,
    backgroundColor: '#fff',
  },
  scheduleContainerBsitter: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    paddingLeft: 30,
    flex: 0.25,
    backgroundColor: '#fff',
  },
  date: {
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
