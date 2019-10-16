import React, { Component } from 'react';
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
      createdUser: 1,
      loggedUser: null,
      sittingDate: moment().format('YYYY-MM-DD'),
      startTime: moment().format('hh:mm:ss'),
      endTime: moment().format('hh:mm:ss'),
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

  async componentDidMount() {
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
          <MuliText style={styles.headerTitle}>BABYSITTING</MuliText>
          <View style={styles.containerDetailInformationRequest}>
            <View>
              <MuliText style={styles.headerText}>Date</MuliText>
            </View>
            <View>
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
          <View style={styles.containerDetailInformationRequest}>
            <MuliText style={styles.headerText}>Start time</MuliText>
            <DatePicker
              style={styles.pickedTime}
              date={this.state.startTime}
              mode="time"
              placeholder="select date"
              format="hh:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(time) => { this.setState({ startTime: time }); console.log(this.state.startTime) }}
              showIcon={false}
            />
          </View>
          <View style={styles.containerDetailInformationRequest}>
            <MuliText style={styles.headerText}>EndTime</MuliText>
            <DatePicker
              style={styles.pickedTime}
              date={this.state.endTime}
              mode="time"
              placeholder="select end time"
              format="hh:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(time) => { this.setState({ endTime: time }); console.log(this.state.endTime) }}
              showIcon={false}
            />
          </View>
          <View style={styles.informationText}>
            <Ionicons
              name='ios-home'
              size={22}
              style={{ marginBottom: -5 }}
              color='#bdc3c7'
            />
            <MuliText style={styles.contentInformation}>Address: {this.state.sittingAddress}</MuliText>
          </View>
          <MuliText style={styles.headerTitle}>CHILDREN</MuliText>
          <View style={{ marginHorizontal: 15 }}>
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
          <View>
            <MuliText style={styles.headerTitle}>Payment</MuliText>
            <MuliText style={styles.contentInformation}>Propose price: {this.state.price}/h</MuliText>
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
  contentInformation: {
    marginHorizontal:15,
    fontSize: 15,
    color: '#315F61',
  },
  informationText: {
    marginHorizontal: 10,
    fontSize: 18,
    marginTop: 30,
    flexDirection: 'row',
    color: '#bdc3c7'
    // backgroundColor: 'red',
  },
  headerText: {
    fontSize: 15,
    fontWeight: '200',
    color: '#707070'
  },
  containerInformationRequest: {
    flex: 1,
    marginHorizontal: 15,
  },
  containerDetailInformationRequest: {
    margin: 10,
  },
  headerTitle: {
    marginLeft: 10,
    marginTop: 30,
    fontSize: 30,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800'
  },
  pickedTime: {
    width: 250,
    height: 40,
    marginTop: 5,
  },
  pickedDate: {
    width: 250,
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
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },

});
