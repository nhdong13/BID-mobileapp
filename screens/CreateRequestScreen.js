import React, { Component } from 'react';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView
} from 'react-native';

import { MuliText } from '../components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';


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
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        keyboardVerticalOffset={60}
        behavior={Platform.OS === "ios" ? 'padding' : 'height'}
      >
        <View style={styles.welcomeContainer}>
          <MuliText>Let's do something new</MuliText>
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
          />
        </View>
        <View style={styles.welcomeContainer}>
          <DatePicker
            style={styles.pickedTime}
            date={this.state.startTime}
            mode="time"
            placeholder="select date"
            format="hh:mm:ss"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(time) => { this.setState({ startTime: time }); console.log(this.state.startTime) }}
          />
        </View>
        <View style={styles.welcomeContainer}>
          <DatePicker
            style={styles.pickedTime}
            date={this.state.endTime}
            mode="time"
            placeholder="select end time"
            format="hh:mm:ss"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(time) => { this.setState({ endTime: time }); console.log(this.state.endTime) }}
          />
        </View>
        <View>

        </View>
        <View style={styles.welcomeContainer}>
          <View style={styles.textContainer}>
            <Ionicons name='ios-home' size={18} style={styles.icon}></Ionicons>
            <MuliText>{this.state.sittingAddress}</MuliText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={this.onCreateRequest}>
            <MuliText style={{ color: 'white', fontSize: 16 }}>Next</MuliText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  title: 'Create new sitting',
  headerStyle: {
    backgroundColor: 'purple',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: '100',
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickedTime: {
    
  },
  pickedDate: {
    backgroundColor: 'red',
    borderWidth: 0,
    width: 300,
    height: 40,
  },
  icon: {
    margin: 15,
    color: 'green',
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
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  logoImage: {
    width: 80,
    height: 36,
    resizeMode: 'contain',
    marginTop: 40,
    marginLeft: -10,
  },
  familyImage: {
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },
  tabBarInfoContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 5,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
