import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';
import { FontAwesome5 } from '@expo/vector-icons';

class ItemHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { request } = this.props;
    return (
      <View>
        {request.status !== 'PENDING' &&
          request.status !== 'ONGOING' &&
          request.status !== 'CONFIRMED' && (
            <TouchableOpacity
              key={request.id}
              style={styles.container}
              onPress={() => {
                console.log('buton pressed');
                this.props.navigation.navigate('RequestDetail', {
                  requestId: request.id,
                });
              }}
            >
              <View style={styles.requestItemSitter}>
                <View style={styles.leftInformationSitter}>
                  <MuliText style={styles.date}>
                    {moment(request.sittingDate).format('dddd Do MMMM')}
                  </MuliText>
                  <MuliText style={{ color: colors.lightGreen }}>
                    {moment.utc(request.startTime, 'HH:mm').format('HH:mm')} đến
                    {moment.utc(request.endTime, ' HH:mm').format(' HH:mm')}
                  </MuliText>
                  <MuliText style={{ marginTop: 15 }}>
                    {/* Từ {request.sittingRequest.user.nickname} */}
                  </MuliText>
                </View>
                <View style={styles.rightInformation}>
                  <View style={styles.statusBoxPending}>
                    <MuliText
                      style={{
                        fontSize: 12,
                        marginRight: 5,
                      }}
                    >
                      {request.status == 'PENDING' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.pending }}
                        >
                          Đang chờ
                        </MuliText>
                      )}
                      {request.status == 'ACCEPTED' && (
                        <MuliText
                          style={{
                            fontWeight: '100',
                            color: colors.lightGreen,
                          }}
                        >
                          Đã chấp nhận
                        </MuliText>
                      )}
                      {request.status == 'DONE' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.done }}
                        >
                          Đã hoàn thành
                        </MuliText>
                      )}
                      {request.status == 'ONGOING' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.ongoing }}
                        >
                          Đang thực hiện
                        </MuliText>
                      )}
                      {request.status == 'EXPIRED' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.canceled }}
                        >
                          Đã hết hạn
                        </MuliText>
                      )}
                      {request.status == 'CONFIRMED' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.confirmed }}
                        >
                          Đã xác nhận
                        </MuliText>
                      )}
                      {request.status == 'SITTER_NOT_CHECKIN' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.canceled }}
                        >
                          Không check-in
                        </MuliText>
                      )}
                      {request.status == 'CANCELED' && (
                        <MuliText
                          style={{ fontWeight: '100', color: colors.canceled }}
                        >
                          Hủy do phụ huynh yêu cầu
                        </MuliText>
                      )}
                    </MuliText>
                  </View>
                  <MuliText style={{ fontSize: 10, marginTop: 10 }}>
                    {formater(request.totalPrice)} đ
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
                    <MuliText>{request.distance}</MuliText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
      </View>
    );
  }
}

export default withNavigation(ItemHistory);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  statusBoxPending: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
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
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  date: {
    marginTop: 5,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
