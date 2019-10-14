import React, { Component } from 'react';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import { MuliText } from '../components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';
import { ScrollView } from 'react-native-gesture-handler';


class CreateRequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenCode: '',
      createdUser: 1,
      sittingDate: moment().format(),
      startTime: moment().format('hh:mm:ss'),
      endTime: moment().format('hh:mm:ss'),
      sittingAddress: 'somewhere only we know',
      detailPictureSitter: require("../assets/images/Phuc.png"),
      detailPictureChildren: require("../assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      price: '100'
    };

    this.onCreateRequest = this.onCreateRequest.bind(this);
  }

  onCreateRequest() {
    const request = {
      createdUser: this.state.createdUser,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
    };

    console.log(request);
  }

  render() {
    return (
      <ScrollView>
      <MuliText style={{ fontSize: 18, fontWeight: 'bold', color: '#315f61' }}>Babysitting</MuliText>
        <View style={styles.container}>        
          <View>
            <MuliText style={{ fontSize: 14, fontWeight: '200', color: '#707070' }}>Date</MuliText>
            <DatePicker
                style={styles.pickedDate}
                date={this.state.sittingDate}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2019-10-01"
                maxDate="2019-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => { this.setState({ sittingDate: date }); console.log(this.state.sittingDate) }}
                showIcon={false}
              />
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputRequest}>
            <MuliText style={{ fontSize: 18, fontWeight: 'bold', color: '#315f61' }}>Babysitting</MuliText>
            <View style={{ marginTop: 30 }}>
              <MuliText style={{ fontSize: 14, fontWeight: '200', color: '#707070' }}>Date</MuliText>
              <DatePicker
                style={styles.pickedDate}
                date={this.state.sittingDate}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2019-10-01"
                maxDate="2019-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(date) => { this.setState({ sittingDate: date }); console.log(this.state.sittingDate) }}
                showIcon={false}
              />
            </View>
            <View style={{ marginTop: 30 }}>
              <MuliText style={{ fontSize: 14, fontWeight: '200', color: '#707070' }}>Start time</MuliText>
              <DatePicker
                style={styles.pickedTime}
                date={this.state.startTime}
                mode="time"
                placeholder="select date"
                format="hh:mm:ss"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(time) => { this.setState({ startTime: time }); console.log(this.state.startTime) }}
                showIcon={false}
              />
              <MuliText style={{ fontSize: 14, fontWeight: '200', color: '#707070' }}>EndTime</MuliText>
              <DatePicker
                style={styles.pickedTime}
                date={this.state.endTime}
                mode="time"
                placeholder="select end time"
                format="hh:mm:ss"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(time) => { this.setState({ endTime: time }); console.log(this.state.endTime) }}
                showIcon={false}
              />
            </View>
            <View style={styles.inputRequest}>
              <MuliText style={{ fontSize: 14, fontWeight: '200', color: '#707070' }}>Address</MuliText>
              <View style={styles.textContainer}>

                <Ionicons name='ios-home' size={18} style={styles.icon}></Ionicons>
                <MuliText>{this.state.sittingAddress}</MuliText>
              </View>
            </View>
          </View>

          <View style={styles.inputRequest}>
            <MuliText style={{ fontSize: 18, fontWeight: 'bold', color: '#315f61' }}>Children</MuliText>
            <View style={styles.detailPictureContainer}>
              <View >
                <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
                <View style={styles.name}>
                  <MuliText >{this.state.nameChildren}</MuliText>
                </View>
              </View>
              <View >
                <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
                <View style={styles.name}>
                  <MuliText >{this.state.nameChildren}</MuliText>
                </View>
              </View>
              <View >
                <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
                <View style={styles.name}>
                  <MuliText >{this.state.nameChildren}</MuliText>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputRequest}>
            <MuliText style={{ fontSize: 18, fontWeight: 'bold', color: '#315f61' }}>Payment</MuliText>
            <View>
              <MuliText>Proposed Price</MuliText>
              <MuliText>{this.state.price}</MuliText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={this.onCreateRequest}>
              <MuliText style={{ color: 'white', fontSize: 16 }}>Next</MuliText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  title: 'Create new sitting',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    alignItems: 'center'
  },
  pickedTime: {
    width: 300,
    height: 40,
    marginTop: 5,
  },
  pickedDate: {
    width: 300,
    height: 40,
    marginTop: 5,
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImg: {
    marginTop: 20,
    width: 70,
    height: 70,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black"
  },
  name: {
    alignItems: "center",
  },
  icon: {
    margin: 15,
  },
  textInput: {
    borderColor: '#EEEEEE',
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: 'muli',
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  inputRequest: {

  },
  timePickerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  welcomeContainer: {
    flex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

});
