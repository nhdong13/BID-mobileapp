import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';

class UpcomingInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { invitation, navigation } = this.props;
    return (
      <View style={styles.container}>
        {invitation.status === 'CONFIRMED' && (
          <TouchableOpacity
            key={invitation.id}
            onPress={() =>
              invitation.status == 'EXPIRED' || invitation.status == 'DENIED'
                ? null
                : navigation.navigate('InvitationDetail', {
                    invitationId: invitation.id,
                  })
            }
          >
            <View style={styles.requestItemSitter}>
              <View style={styles.leftInformationSitter}>
                <MuliText style={styles.date}>
                  {moment(invitation.sittingRequest.sittingDate).format(
                    'dddd Do MMMM',
                  )}
                </MuliText>
                <MuliText style={{ color: '#7edeb9' }}>
                  {moment
                    .utc(invitation.sittingRequest.startTime, 'HH:mm')
                    .format('HH:mm')}{' '}
                  đến
                  {moment
                    .utc(invitation.sittingRequest.endTime, ' HH:mm')
                    .format(' HH:mm')}
                </MuliText>
                <MuliText style={{ marginTop: 15 }}>
                  Từ {invitation.sittingRequest.user.nickname}
                </MuliText>
              </View>
              <View style={styles.rightInformation}>
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    Đã xác nhận
                  </MuliText>
                </View>
                <MuliText style={{ fontSize: 10, marginTop: 10 }}>
                  Giá tiền {formater(invitation.sittingRequest.totalPrice)} Đồng
                </MuliText>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default withNavigation(UpcomingInvitation);

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    alignItems: 'center',
    // backgroundColor: 'red',
    // backgroundColor: '#dfe6e9',
    paddingVertical: 5,
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
    alignItems: 'flex-end',
    // backgroundColor: 'green',
    height: 40,
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 150,
    width: 350,
    margin: 10,
    alignItems: 'center',
    borderRadius: 15,
    elevation: 2,
    // marginBottom: 5,
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'violet',
    height: 180,
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  leftInformationSitter: {
    marginLeft: 10,
    flex: 1,
  },
  fuckthisshit: {},
  leftInformation: {
    margin: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  rightInformation: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
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
    marginTop: 10,
    // marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
