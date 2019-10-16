import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import { MuliText } from 'components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';
import { ScrollView } from 'react-native-gesture-handler';
import Api from 'api/api_helper';

class CreateRequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenCode: '',
      createdUser: null,
      loggedUser: null,
      sittingDate: moment().format('YYYY-MM-DD'),
      startTime: moment().format('HH:mm:ss'),
      endTime: moment().format('HH:mm:ss'),
      sittingAddress: null,
      detailPictureSitter: require("assets/images/Phuc.png"),
      detailPictureChildren: require("assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      price: '100',
      childrenNumber: 1,
      minAgeOfChildren: 1,
    };

    this.onCreateRequest = this.onCreateRequest.bind(this);
  }

  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ createdUser: userId, roleId: roleId })
    })
  }


  async componentDidMount() {
    await this.getDataAccordingToRole();

    Api.get('users/' + this.state.createdUser.toString()).then(res => {
      this.setState({ loggedUser: res, sittingAddress: res.address });
    });
  }

  onCreateRequest() {
    const request = {
      createdUser: this.state.createdUser,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
    };
    console.log(request);
    Api.post('sittingRequests', request);
  }

  render() {
    return (
      <ScrollView>

        <View style={styles.containerInformationRequest}>
          <MuliText style={styles.headerTitle}>Babysitting</MuliText>
          <View>
            <View style={styles.inputDay}>
              <Ionicons
                name='ios-calendar'
                size={25}
                color='#7edeb9'
                style={{
                  marginTop: 8,
                }}
              />
              <DatePicker
                style={styles.pickedDate}
                date={this.state.sittingDate}
                mode="date"
                placeholder="Date"
                format="YYYY-MM-DD"
                minDate="2019-10-01"
                maxDate="2019-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 20,
                    color: "#C7C7C7",
                    marginRight: 70,
                  },
                  dateText: {
                    fontSize: 20,
                    color: "#7edeb9",
                  }
                }}
                onDateChange={(date) => { this.setState({ sittingDate: date }); console.log(this.state.sittingDate) }}
                showIcon={false}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <View style={styles.input}>
                <Ionicons
                  name='ios-timer'
                  size={25}
                  color='#bdc3c7'
                  style={{
                    marginTop: 8,
                  }}
                />

                <DatePicker
                  style={styles.pickedTime}
                  date={this.state.startTime}
                  mode="time"
                  placeholder="Start time"
                  format="hh:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 20,
                      color: "#C7C7C7",
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 20,
                      color: "black",
                    }
                  }}
                  is24Hour
              onDateChange={(time) => { this.setState({ startTime: time }); console.log(this.state.startTime) }}
                  showIcon={false}
                />
              </View>
            </View>
            <View>
              <View style={styles.input}>
                <Ionicons
                  name='ios-time'
                  size={25}
                  color='#bdc3c7'
                  style={{
                    marginTop: 8,
                  }}
                />
                <DatePicker
                  style={styles.pickedTime}
                  date={this.state.endTime}
                  mode="time"
                  placeholder="End time"
                  format="hh:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 20,
                      color: "#C7C7C7",
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 20,
                      color: "black",
                    }
                  }}
                  is24Hour
              onDateChange={(time) => { this.setState({ endTime: time }); console.log(this.state.endTime) }}
                  showIcon={false}
                />
              </View>
            </View>        
          </View>
          <View style={styles.input}>
            <Ionicons
              name='ios-home'
              size={25}
              color='#bdc3c7'
              style={{
                marginBottom: 5,
              }}
            />
            <MuliText style={styles.contentInformation}>Address: {this.state.sittingAddress}</MuliText>
          </View>
          <MuliText style={styles.headerTitle}>Children</MuliText>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.input}>
              <Ionicons
                name='ios-happy'
                size={25}
                color='#bdc3c7'
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>We have {this.state.childrenNumber} chilren</MuliText>
            </View>
            <View style={styles.input}>
              <Ionicons
                name='ios-heart-empty'
                size={25}
                color='#bdc3c7'
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>Min Age: {this.state.minAgeOfChildren}</MuliText>
            </View>
          </View>
          <View>
            <MuliText style={styles.headerTitle}>Payment</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>Propose price:</MuliText>
              <MuliText style={styles.price}>{this.state.price}/h</MuliText>

            </View>

          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={this.onCreateRequest}>
            <MuliText style={{ color: 'white', fontSize: 16 }}>Next</MuliText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  }
}

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  price:{
    fontSize: 20,
    color: '#7edeb9',
    fontWeight: '800'
  },
  priceContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDay: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
    borderColor: '#7edeb9'
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
  },
  contentInformation: {
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 20,
  },
  containerInformationRequest: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 25,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800'
  },
  submitButton: {
    width: 200,
    height: 50,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
});
