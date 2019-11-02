import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import { retrieveToken } from 'utils/handleToken';
import Api from 'api/api_helper';
import {updateBsProfile} from 'api/babysitter.api';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
// import { RadioButton } from 'react-native-paper';
export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fr1: false,
      fr2: false,
      fr3: false,
      fr4: false,
      fr5: false,
      fr6: false,
      fr7: false,
      daytimes: [],
      evenings: [],
      dStart: '',
      dEnd: '',
      nStart: '',
      nEnd: '',
      userId: 0,
      phdS: { label: 'Từ', value: null, color: '#9EA0A4' },
      phdE: { label: 'Đến', value: null, color: '#9EA0A4' },
      phnS: { label: 'Từ', value: null, color: '#9EA0A4' },
      phnE: { label: 'Đến', value: null, color: '#9EA0A4' },
    };
  }

  componentDidMount() {
    this.getUserId();
    let temp = [];
    for (let i = 8; i < 18; i++) {
      if (i<10) temp.push({ label: i.toString() + 'H', value: '0'+ i.toString() })
      else temp.push({ label: i.toString() + 'H', value: i.toString() });
    }
    this.setState({ daytimes: temp });
    temp = [];
    for (let i = 18; i < 23; i++) {
      temp.push({ label: i.toString() + 'H', value: i.toString() });
    }
    this.setState({ evenings: temp });
    this.getUserId().then(res => {
      Api.get('babysitters/' + this.state.userId.toString()).then(res => {
        if (res.evening != null) this.setState({
          phnS: { label: res.evening[0] + res.evening[1] + 'H', value: res.evening[0] + res.evening[1], color: '#9EA0A4' },
          phnE: { label: res.evening[3] + res.evening[4] + 'H', value: res.evening[3] + res.evening[4], color: '#9EA0A4' },
        });
        if (res.daytime != null) this.setState({
          phdS: { label: res.daytime[0] + res.daytime[1] + 'H', value: res.daytime[0] + res.daytime[1], color: '#9EA0A4' },
          phdE: { label: res.daytime[3] + res.daytime[4] + 'H', value: res.daytime[3] + res.daytime[4], color: '#9EA0A4' },
        });
        console.log(res.evening[0] + res.evening[1]);
        let workDays = res.weeklySchedule.split(',');
        workDays.forEach(element => {
          if (element == 'MON') this.setState({ fr1: true });
          if (element == 'TUE') this.setState({ fr2: true });
          if (element == 'WED') this.setState({ fr3: true });
          if (element == 'THU') this.setState({ fr4: true });
          if (element == 'FRI') this.setState({ fr5: true });
          if (element == 'SAT') this.setState({ fr6: true });
          if (element == 'SUN') this.setState({ fr7: true });
        });
      });
    });
  }

  getUserId = async () => {
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });
  };

  save = () => {
    let req = 0;
    if (parseInt(this.state.dStart) > 7 && parseInt(this.state.dStart) < 18) req += 1;
    if (parseInt(this.state.dEnd) > 7 && parseInt(this.state.dEnd) < 18) req += 1;
    if (parseInt(this.state.nStart) > 17 && parseInt(this.state.nStart) < 23) req += 1;
    if (parseInt(this.state.nEnd) > 17 && parseInt(this.state.nEnd) < 23) req += 1;
    if (req != 4 || parseInt(this.state.dStart) > parseInt(this.state.dEnd) 
      || parseInt(this.state.nStart) > parseInt(this.state.nEnd)) return;
    let temp = '';
    if (this.state.fr1) temp += 'MON,';
    if (this.state.fr2) temp += 'TUE,';
    if (this.state.fr3) temp += 'WED,';
    if (this.state.fr4) temp += 'THU,';
    if (this.state.fr5) temp += 'FRI,';
    if (this.state.fr6) temp += 'SAT,';
    if (this.state.fr7) temp += 'SUN,';
    const body = {
      daytime: this.state.dStart + '-' + this.state.dEnd,
      evening: this.state.nStart + '-' + this.state.nEnd,
      weeklySchedule: temp,
    };
    console.log(body);
    updateBsProfile(this.state.userId, body);
  }

  render() {
    return (
      <View>
        <View style={{ marginTop: 35, marginLeft: 10, alignItems: 'center' }}>
          <MuliText style={styles.headerTitle}>Lịch</MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Lịch giữ trẻ của tôi
          </MuliText>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 15 }}>
          <View style={styles.hide} />
          <View style={{ flexDirection: 'row' }}>
            <MuliText style={styles.dayText}>T2</MuliText>
            <MuliText style={styles.dayText}>T3</MuliText>
            <MuliText style={styles.dayText}>T4</MuliText>
            <MuliText style={styles.dayText}>T5</MuliText>
            <MuliText style={styles.dayText}>T6</MuliText>
            <MuliText style={styles.dayText}>T7</MuliText>
            <MuliText style={styles.dayText}>CN</MuliText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
          <View st style={{ marginTop: 10 }}>
            <MuliText>Ngày</MuliText>
            <MuliText style={{ fontWeight: 'bold' }}>làm việc</MuliText>
          </View>
          {/* Radio button */}
          <View style={{ flexDirection: 'row', marginLeft: 22, marginTop: 12 }}>
            <CheckBox
              style={{ width: 22, marginLeft: 10 }}
              checked={this.state.fr1}
              onPress={() => this.setState({ fr1: !this.state.fr1 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr2}
              onPress={() => this.setState({ fr2: !this.state.fr2 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr3}
              onPress={() => this.setState({ fr3: !this.state.fr3 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr4}
              onPress={() => this.setState({ fr4: !this.state.fr4 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr5}
              onPress={() => this.setState({ fr5: !this.state.fr5 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr6}
              onPress={() => this.setState({ fr6: !this.state.fr6 })}
            />
            <CheckBox
              style={{ width: 22, marginLeft: 15 }}
              checked={this.state.fr7}
              onPress={() => this.setState({ fr7: !this.state.fr7 })}
            />
          </View>
          {/* End Radio button */}
        </View>

        <View style={{ height: 150, marginTop: 30 }}>
          <View style={{ flexDirection: 'row' }}>
            <MuliText
              style={{
                width: 80,
                marginLeft: 20,
                marginRight: 40,
              }}
            >
              Ban ngày
            </MuliText>
            <View style={{ width: 30 }}>
            <RNPickerSelect
              placeholder={this.state.phdS}
              value={this.state.phdS}
              onValueChange={(value) => this.setState({dStart: value})}
              items={this.state.daytimes}
            />
            </View>
            <MuliText style={{ width: 30, marginLeft: 30, fontSize: 17 }}>
              -
            </MuliText>
            <View style={{ width: 30, marginLeft: 20 }}>
            <RNPickerSelect
              placeholder={this.state.phdE}
              value={this.state.phdE}
              onValueChange={(value) => this.setState({dEnd: value})}
              items={this.state.daytimes}
            />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <MuliText
              style={{
                width: 80,
                marginLeft: 20,
                marginRight: 40,
              }}
            >
              Ban đêm
            </MuliText>
            <View style={{ width: 30 }}>
              <RNPickerSelect
                placeholder={this.state.phnS}
                value={this.state.phnS}
                style={{ width: 50 }}
                onValueChange={(value) => this.setState({nStart: value})}
                items={this.state.evenings}
              />
            </View>
            <MuliText style={{ width: 30, marginLeft: 30, fontSize: 17 }}>
              -
            </MuliText>
            <View style={{ width: 30, marginLeft: 20 }}>
            <RNPickerSelect
              placeholder={this.state.phnE}
              value={this.state.phnE}
              onValueChange={(value) => this.setState({nEnd: value})}
              items={this.state.evenings}
            />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={this.save}>
            <MuliText style={{ color: 'white', fontSize: 16 }}>Lưu</MuliText>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#315F61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 10,
  },
  dayText: {
    marginLeft: 15,
    width: 22,
  },
  radioButton: {
    marginLeft: 20,
    marginTop: 20,
  },
  hide: {
    backgroundColor: 'white',
    width: 95,
  },
  netWorkContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 15,
    height: 200,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  textReview: {
    marginLeft: 8,
    marginRight: 100,
    flex: 1,
  },
  line: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  reivewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameReview: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#315F61',
  },
  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  textOption: {
    marginHorizontal: 5,
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg2: {
    width: 60,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImg: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginTop: 10,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 100,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    fontWeight: '200',
    marginLeft: 10,
  },
});
