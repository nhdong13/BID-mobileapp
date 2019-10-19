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
      sittingDate: null,
      startTime: null,
      endTime: null,
      sittingAddress: null,
      detailPictureSitter: require("assets/images/Phuc.png"),
      detailPictureChildren: require("assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      price: '100',
      childrenNumber: 2,
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
    Api.post('sittingRequests', request).then((res) => {
      if (res) {
        this.props.navigation.navigate('Recommend', { requestId: res.id });
      }
    }).catch(error => console.log(error));

  }

  render() {
    return (
      <ScrollView>

        <View style={styles.containerInformationRequest}>
          <MuliText style={styles.headerTitle}>Trông trẻ</MuliText>
          <View>
            <View style={styles.inputDay}>
              <Ionicons
                name='ios-calendar'
                size={20}
                color='#7edeb9'
                style={{
                  marginTop: 10,
                }}
              />
              <DatePicker
                style={styles.pickedDate}
                date={this.state.sittingDate}
                mode="date"
                placeholder="Date"
                format="YYYY-MM-DD"
                minDate={moment().format('YYYY-MM-DD')}
                maxDate="2019-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 15,
                    color: "#C7C7C7",
                    marginRight: 70,
                  },
                  dateText: {
                    fontSize: 15,
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
                  size={20}
                  color='#bdc3c7'
                  style={{
                    marginTop: 10,
                  }}
                />

                <DatePicker
                  style={styles.pickedTime}
                  date={this.state.startTime}
                  minDate={moment().format()}
                  maxDate={this.state.endTime}
                  mode="time"
                  placeholder="Start time"
                  format="HH:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 15,
                      color: "#C7C7C7",
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 15,
                      color: "black",
                    }
                  }}
                  is24Hour
                  onDateChange={(time) => { this.setState({ startTime: time}); console.log(this.state.startTime) }}
                  showIcon={false}
                />
              </View>
            </View>
            <View>
              <View style={styles.input}>
                <Ionicons
                  name='ios-time'
                  size={20}
                  color='#bdc3c7'
                  style={{
                    marginTop: 10,
                  }}
                />
                <DatePicker
                  style={styles.pickedTime}
                  minDate={(this.state.startTime)}
                  date={this.state.endTime}
                  mode="time"
                  placeholder="End time"
                  format="HH:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 15,
                      color: "#C7C7C7",
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 15,
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
              size={20}
              color='#bdc3c7'
              style={{
                marginBottom: 5,
              }}
            />
            <MuliText style={styles.contentInformation}>Địa chỉ: {this.state.sittingAddress}</MuliText>
          </View>
          <MuliText style={styles.headerTitle}>Trẻ em</MuliText>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.input}>
              <Ionicons
                name='ios-happy'
                size={20}
                color='#bdc3c7'
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>Số trẻ: {this.state.childrenNumber} </MuliText>
            </View>
            <View style={styles.input}>
              <Ionicons
                name='ios-heart-empty'
                size={20}
                color='#bdc3c7'
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>Nhỏ tuổi nhất: {this.state.minAgeOfChildren}</MuliText>
            </View>
          </View>
          <View>
            <MuliText style={styles.headerTitle}>Thanh toán</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>Số tiền dự kiến:</MuliText>
              <MuliText style={styles.price}>{this.state.price}VND/h</MuliText>

            </View>

          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={this.onCreateRequest}>
              <MuliText style={{ color: 'white', fontSize: 16 }}>Kế tiếp</MuliText>
            </TouchableOpacity>
          </View>
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
  price: {
    fontSize: 15,
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
    fontSize: 12,
  },
  containerInformationRequest: {
    marginHorizontal: 15,
    marginTop: 30,
  },
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 20,
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
