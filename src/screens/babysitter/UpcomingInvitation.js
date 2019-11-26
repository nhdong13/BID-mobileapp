import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';
import { FontAwesome5 } from '@expo/vector-icons';

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
                <MuliText style={{ color: colors.lightGreen }}>
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
                  Giá tiền {formater(invitation.sittingRequest.totalPrice)} đ
                </MuliText>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                  }}
                >
                  <FontAwesome5
                    name="directions"
                    size={20}
                    color={colors.darkGreenTitle}
                    style={{ marginRight: 5 }}
                  />
                  <MuliText>{invitation.distance}</MuliText>
                </View>
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
    paddingVertical: 5,
  },
  statusBoxPending: {
    alignItems: 'flex-end',
    height: 40,
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
    elevation: 3,
  },
  leftInformationSitter: {
    marginLeft: 10,
    flex: 1,
  },
  rightInformation: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  date: {
    marginTop: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
