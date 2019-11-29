import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';
import { FontAwesome5 } from '@expo/vector-icons';

class PendingInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { invitation, navigation } = this.props;
    return (
      <View>
        {invitation.status === 'PENDING' && (
          <TouchableOpacity
            key={invitation.id}
            style={styles.container}
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
                    Chờ phê duyệt
                  </MuliText>
                </View>
                <MuliText style={{ fontSize: 9, marginTop: 10 }}>
                  {formater(invitation.sittingRequest.totalPrice)} đ
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

export default withNavigation(PendingInvitation);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  statusBoxPending: {
    alignItems: 'flex-end',
    height: 40,
    width: 80,
  },
  requestItemSitter: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 150,
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 5,
  },
  leftInformationSitter: {
    marginLeft: 10,
  },
  rightInformation: {
    alignContent: 'flex-end',
    marginLeft: 'auto',
  },
  date: {
    marginTop: 5,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
