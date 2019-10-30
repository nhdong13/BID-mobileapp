import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Radio,
} from 'native-base';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
// import { RadioButton } from 'react-native-paper';
export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
      selected10: true,
      selected11: true,
      selected12: true,
    };
  }

  render() {
    return (
      <View>
        <View style={{ marginTop: 35, marginLeft: 10 }}>
          <MuliText style={styles.headerTitle}>Lịch</MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Lịch giữ trẻ của tôi
          </MuliText>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={styles.hide} />
          <View style={{ flexDirection: 'row' }}>
            <MuliText>T2</MuliText>
            <MuliText style={styles.dayText}>T3</MuliText>
            <MuliText style={styles.dayText}>T4</MuliText>
            <MuliText style={styles.dayText}>T5</MuliText>
            <MuliText style={styles.dayText}>T6</MuliText>
            <MuliText style={styles.dayText}>T7</MuliText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <View st>
            <MuliText>Sáng</MuliText>
            <MuliText style={{ fontWeight: 'bold' }}>5:00 - 17:00</MuliText>
          </View>
          {/* Radio button */}
          <View style={{ flexDirection: 'row' }}>
            <Radio
              style={{ marginTop: 20, marginLeft: 12 }}
              selected={this.state.selected1}
              onPress={() =>
                this.setState({ selected1: !this.state.selected1 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected2}
              onPress={() =>
                this.setState({ selected2: !this.state.selected2 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected3}
              onPress={() =>
                this.setState({ selected3: !this.state.selected3 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected4}
              onPress={() =>
                this.setState({ selected4: !this.state.selected4 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected5}
              onPress={() =>
                this.setState({ selected5: !this.state.selected5 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected6}
              onPress={() =>
                this.setState({ selected6: !this.state.selected6 })
              }
            />
          </View>
          {/* End Radio button */}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
          <View>
            <MuliText>Tối</MuliText>
            <MuliText style={{ fontWeight: 'bold' }}>17:00 - 5:00</MuliText>
          </View>
          {/* Radio button */}
          <View style={{ flexDirection: 'row' }}>
            <Radio
              style={{ marginTop: 20, marginLeft: 12 }}
              selected={this.state.selected7}
              onPress={() =>
                this.setState({ selected7: !this.state.selected7 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected8}
              onPress={() =>
                this.setState({ selected8: !this.state.selected8 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected9}
              onPress={() =>
                this.setState({ selected9: !this.state.selected9 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected10}
              onPress={() =>
                this.setState({ selected10: !this.state.selected10 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected11}
              onPress={() =>
                this.setState({ selected11: !this.state.selected11 })
              }
            />
            <Radio
              style={styles.radioButton}
              selected={this.state.selected12}
              onPress={() =>
                this.setState({ selected12: !this.state.selected12 })
              }
            />
          </View>
          {/* End Radio button */}
        </View>
      </View>
    );
  }
}
CalendarScreen.navigationOptions = {
  title: 'Lịch',
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  dayText: {
    marginLeft: 20,
  },
  radioButton: {
    marginLeft: 20,
    marginTop: 20,
  },
  hide: {
    marginLeft: 10,
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
