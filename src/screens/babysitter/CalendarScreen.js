/* eslint-disable no-undef */
/* eslint-disable react/no-string-refs */
/* eslint-disable nonblock-statement-body-position */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Picker,
  ScrollView,
} from 'react-native';
import { CheckBox } from 'native-base';
import { retrieveToken } from 'utils/handleToken';
import { updateBsProfile, getProfile } from 'api/babysitter.api';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import Toast from 'react-native-easy-toast';
import AlertPro from 'react-native-alert-pro';
// import { RadioButton } from 'react-native-paper';
export default class CalendarScreen extends Component {
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
      startTime: '08:00',
      endTime: '20:00',
      minAgeOfChildren: 1,
      maxNumOfChildren: 1,
      sitterId: 0,
      notificationMessage: '',
      title: '',
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
    };
  }

  async componentDidMount() {
    await this.getUserId().then(async () => {
      const { sitterId } = this.state;
      if (sitterId != 0) {
        await getProfile(sitterId).then(async (res) => {
          const {
            startTime,
            endTime,
            weeklySchedule,
            minAgeOfChildren,
            maxNumOfChildren,
          } = res;
          await this.setState({
            startTime,
            endTime,
            minAgeOfChildren,
            maxNumOfChildren,
          });
          const workDays = weeklySchedule.split(',');
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
                console.log(
                  'Error in getprofile sitter -> CalendarScreen -> switch',
                );
                break;
            }
          });
        });
      }
    });
  }

  getUserId = async () => {
    await retrieveToken().then((res) => {
      const { userId } = res;
      if (userId != 0) {
        this.setState({ sitterId: userId });
      }
    });
  };

  updateSchedule = async () => {
    const {
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      startTime,
      endTime,
      sitterId,
      minAgeOfChildren,
      maxNumOfChildren,
    } = this.state;
    const workDays = [];

    if (mon) workDays.push('MON');
    if (tue) workDays.push('TUE');
    if (wed) workDays.push('WED');
    if (thu) workDays.push('THU');
    if (fri) workDays.push('FRI');
    if (sat) workDays.push('SAT');
    if (sun) workDays.push('SUN');

    const stringWorkDays = workDays.join();

    const body = {
      startTime: startTime,
      endTime: endTime,
      weeklySchedule: stringWorkDays,
      minAgeOfChildren: minAgeOfChildren,
      maxNumOfChildren: maxNumOfChildren,
    };

    await updateBsProfile(sitterId, body).then((res) => {
      if (res.status == '200') {
        this.refs.toast.show('Cập nhật lịch làm việc thành công');
      } else {
        this.refs.toast.show(
          'Đã có lỗi xảy ra vui lòng kiểm tra lại thông tin và thử lại',
        );
      }
    });

    this.AlertPro.close();
  };

  confirmModalPopup = () => {
    this.setState({
      notificationMessage: 'Bạn có chắc chắn muốn đổi lịch làm việc ?',
      title: 'Thay đổi lịch làm việc',
      showConfirm: true,
      textConfirm: 'Có',
      showCancel: true,
      textCancel: 'Không',
    });
    this.AlertPro.open();
  };

  render() {
    const {
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      startTime,
      endTime,
      minAgeOfChildren,
      maxNumOfChildren,
      notificationMessage,
      title,
      showConfirm,
      textConfirm,
      showCancel,
      textCancel,
    } = this.state;

    return (
      <View>
        <Toast ref="toast" position="top" />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.updateSchedule()}
          onCancel={() => this.AlertPro.close()}
          title={title}
          message={notificationMessage}
          showConfirm={showConfirm}
          showCancel={showCancel}
          textCancel={textCancel}
          textConfirm={textConfirm}
          customStyles={{
            mask: {
              backgroundColor: 'transparent',
            },
            container: {
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            buttonCancel: {
              backgroundColor: colors.canceled,
            },
            buttonConfirm: {
              backgroundColor: colors.buttonConfirm,
            },
          }}
        />
        <ScrollView>
          <View style={{ marginTop: 35, alignItems: 'center' }}>
            <MuliText style={styles.headerTitle}>Lịch</MuliText>
            <MuliText style={styles.grayOptionInformation}>
              Lịch giữ trẻ của tôi
            </MuliText>
          </View>

          <View
            style={{ marginTop: 30, marginBottom: 15, alignItems: 'center' }}
          >
            <View style={{ flexDirection: 'row' }}>
              <MuliText style={styles.dayText}>CN</MuliText>
              <MuliText style={styles.dayText}>T2</MuliText>
              <MuliText style={styles.dayText}>T3</MuliText>
              <MuliText style={styles.dayText}>T4</MuliText>
              <MuliText style={styles.dayText}>T5</MuliText>
              <MuliText style={styles.dayText}>T6</MuliText>
              <MuliText style={styles.dayText}>T7</MuliText>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {/* Radio button */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 12,
                marginLeft: -15,
              }}
            >
              <CheckBox
                style={styles.radioButton}
                checked={sun}
                onPress={() => this.setState({ sun: !this.state.sun })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={mon}
                onPress={() => this.setState({ mon: !this.state.mon })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={tue}
                onPress={() => this.setState({ tue: !this.state.tue })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={wed}
                onPress={() => this.setState({ wed: !this.state.wed })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={thu}
                onPress={() => this.setState({ thu: !this.state.thu })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={fri}
                onPress={() => this.setState({ fri: !this.state.fri })}
              />
              <CheckBox
                style={styles.radioButton}
                checked={sat}
                onPress={() => this.setState({ sat: !this.state.sat })}
              />
            </View>
            {/* End Radio button */}
          </View>

          <View style={{ marginTop: 20, marginHorizontal: 20 }}>
            <MuliText>Giờ bắt đầu</MuliText>
            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
              <Picker
                selectedValue={startTime}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => {
                  this.setState({ startTime: itemValue });
                  if (
                    parseInt(itemValue.split(':')[0], 10) >
                    parseInt(endTime.split(':')[0], 10)
                  ) {
                    this.setState({ endTime: itemValue });
                  }
                }}
              >
                <Picker.Item label="08:00" value="08:00" />
                <Picker.Item label="09:00" value="09:00" />
                <Picker.Item label="10:00" value="10:00" />
                <Picker.Item label="11:00" value="11:00" />
                <Picker.Item label="12:00" value="12:00" />
                <Picker.Item label="13:00" value="13:00" />
                <Picker.Item label="14:00" value="14:00" />
                <Picker.Item label="15:00" value="15:00" />
                <Picker.Item label="16:00" value="16:00" />
                <Picker.Item label="17:00" value="17:00" />
                <Picker.Item label="18:00" value="18:00" />
                <Picker.Item label="19:00" value="19:00" />
                <Picker.Item label="20:00" value="20:00" />
                <Picker.Item label="21:00" value="21:00" />
                <Picker.Item label="22:00" value="22:00" />
              </Picker>
            </View>
            <MuliText>Giờ kết thúc</MuliText>
            <View style={{ flexDirection: 'row' }}>
              <Picker
                selectedValue={endTime}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue) => {
                  this.setState({ endTime: itemValue });
                  if (
                    parseInt(itemValue.split(':')[0], 10) <
                    parseInt(startTime.split(':')[0], 10)
                  ) {
                    this.setState({ startTime: itemValue });
                  }
                }}
              >
                <Picker.Item label="09:00" value="09:00" />
                <Picker.Item label="10:00" value="10:00" />
                <Picker.Item label="11:00" value="11:00" />
                <Picker.Item label="12:00" value="12:00" />
                <Picker.Item label="13:00" value="13:00" />
                <Picker.Item label="14:00" value="14:00" />
                <Picker.Item label="15:00" value="15:00" />
                <Picker.Item label="16:00" value="16:00" />
                <Picker.Item label="17:00" value="17:00" />
                <Picker.Item label="18:00" value="18:00" />
                <Picker.Item label="19:00" value="19:00" />
                <Picker.Item label="20:00" value="20:00" />
                <Picker.Item label="21:00" value="21:00" />
                <Picker.Item label="22:00" value="22:00" />
                <Picker.Item label="23:00" value="23:00" />
              </Picker>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 30,
              }}
            >
              <View style={{}}>
                <View>
                  <MuliText>Độ tuổi nhỏ nhất</MuliText>
                </View>
                <View>
                  <Picker
                    selectedValue={`${minAgeOfChildren}`}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => {
                      this.setState({ minAgeOfChildren: itemValue });
                    }}
                  >
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                  </Picker>
                </View>
              </View>

              <View>
                <MuliText>Số lượng trẻ</MuliText>
                <Picker
                  selectedValue={`${maxNumOfChildren}`}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue) => {
                    this.setState({ maxNumOfChildren: itemValue });
                  }}
                >
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.confirmModalPopup()}
            >
              <MuliText style={{ color: 'white', fontSize: 16 }}>Lưu</MuliText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
CalendarScreen.navigationOptions = {
  title: 'Lịch',
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  submitButton: {
    width: 200,
    height: 50,
    padding: 10,
    marginTop: 20,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    marginHorizontal: 10,
    width: 22,
  },
  radioButton: {
    marginHorizontal: 11,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: '200',
    marginLeft: 10,
  },
});
