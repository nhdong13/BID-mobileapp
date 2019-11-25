import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import localization from 'moment/locale/vi';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';

moment.updateLocale('vi', localization);

class ParentRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { request } = this.props;
    return (
      <View style={styles.container}>
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
                {moment.utc(request.startTime, 'HH:mm').format('HH:mm')} đến
                {moment.utc(request.endTime, ' HH:mm').format(' HH:mm')}
              </MuliText>
            </View>
            <View style={styles.rightInformation}>
              {request.status == 'PENDING' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'DONE' && (
                <View style={styles.statusBoxPending}>
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'ONGOING' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.ongoing }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'CANCELED' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'CONFIRMED' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.confirmed }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              <MuliText>{formater(request.totalPrice)} đ</MuliText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(ParentRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeColor,
  },
  statusBoxPending: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 130,
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  leftInformation: {
    paddingLeft: 10,
    flex: 1,
  },
  rightInformation: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  date: {
    marginTop: 5,
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
