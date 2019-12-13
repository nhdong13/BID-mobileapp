import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import colors from 'assets/Color';
import { FontAwesome5 } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

class RepeatedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };
  }

  componentDidMount() {
    const { request } = this.props;

    const workDays = request.repeatedDays.split(',');
    workDays.forEach((day) => {
      switch (day) {
        case 'MON':
          this.setState({ mon: true });
          break;
        case 'TUE':
          this.setState({ tue: true });
          break;
        case 'WED':
          this.setState({ wed: true });
          break;
        case 'THU':
          this.setState({ thu: true });
          break;
        case 'FRI':
          this.setState({ fri: true });
          break;
        case 'SAT':
          this.setState({ sat: true });
          break;
        case 'SUN':
          this.setState({ sun: true });
          break;
        default:
          console.log('Error in getprofile sitter -> CalendarScreen -> switch');
          break;
      }
    });
  }

  render() {
    const { request } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 10,
          height: height / 2.7,
          marginHorizontal: 10,
          marginTop: 15,
          marginVertical: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            marginHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray,
            paddingBottom: 5,
          }}
        >
          <FontAwesome5
            name="directions"
            size={20}
            color={colors.gray}
            style={{ marginRight: 5 }}
          />
          <MuliText style={{ color: colors.gray }}>YÊU CẦU TRÔNG TRẺ</MuliText>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <MuliText style={{ marginRight: 15 }}>Ngày bắt đầu</MuliText>
              <MuliText style={{ fontWeight: 'bold' }}>
                {request.startDate}
              </MuliText>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <MuliText style={{ marginRight: 15 }}>Thời gian</MuliText>
              <MuliText style={{ fontWeight: 'bold' }}>
                {request.startTime} - {request.endTime}
              </MuliText>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <MuliText style={{ marginRight: 15 }}>Địa chỉ</MuliText>
              <MuliText style={{ flex: 1, fontWeight: 'bold' }}>
                {request.sittingAddress}
              </MuliText>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
              <MuliText style={{ marginRight: 15 }}>Tình trạng</MuliText>
              <MuliText style={{ fontWeight: 'bold' }}>
                {request.status}
              </MuliText>
            </View>
          </View>

          <View style={{ marginTop: 20, marginHorizontal: 5 }}>
            <MuliText style={{ marginBottom: 5, fontSize: 12, marginLeft: 5 }}>
              Lặp lại hàng tuần
            </MuliText>
            <View style={styles.repeatedRequest}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#ecf0f1',
                  flex: 1,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ sun: !this.state.sun })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sun ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      CN
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ mon: !this.state.mon })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.mon ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T2
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ tue: !this.state.tue })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.tue ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T3
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ wed: !this.state.wed })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.wed ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T4
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ thu: !this.state.thu })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.thu ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T5
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ fri: !this.state.fri })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.fri ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T6
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ sat: !this.state.sat })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sat ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T7
                    </MuliText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(RepeatedItem);

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
  repeatedRequest: {
    flexDirection: 'row',
    // marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
});
