import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Button, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from "components/StyledText";
import moment from 'moment';
import Modal from 'react-native-modal';
import Api from 'api/api_helper';

export default class InvitationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationID: this.props.navigation.state.params.invitationId,
      date: '2019-10-03',
      startTime: '12:00 AM',
      endTime: '3:00 AM',
      address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
      price: '30/H',
      detailPictureChildren: require("assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      detailPictureParent: require("assets/images/Phuc.png"),
      nameSitter: 'Phuc',
      status: null,
      isModalVisible: false,
      requestId: 1,
      invitationStatus: 'PENDING',
      childrenNumber: 1,
      minAgeOfChildren: 1,
    }
  }

  getData = async () => {
    await Api.get('invitations/' + this.state.invitationID.toString()).then(resp => {
      this.setState({
        invitationStatus: resp.status, date: resp.sittingRequest.sittingDay, requestId: resp.sittingRequest.id, startTime: resp.sittingRequest.startTime,
        endTime: resp.sittingRequest.endTime, address: resp.sittingRequest.sittingAddress, status: resp.sittingRequest.status
      })
    })
  }
  onLogin = () => {
    this.setState({ isModalVisible: true })
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  componentDidMount() {
    this.getData();
  }

  onButtonClick = (targetStatus) => {
    console.log(targetStatus);
    const ivBody = {
      status: targetStatus,
    };
    // console.log(rqBody); console.log(this.state.sittingRequestsID);
    Api.put('invitations/' + this.state.invitationID.toString(), ivBody).then(resp => {
      // this.props.navigation.navigate.goBack();
    });

    // rqBody = {
    //   status: 'CONFIRMED',
    // }
    // Api.put('sittingRequests/' + this.state.requestId.toString(), rqBody).then(resp => {
    //   // this.props.navigation.navigate.goBack();
    // });
  }

  render() {
    return (

      <ScrollView>
        <View style={{ marginHorizontal: 30, backgroundColor: 'white' }}>
          <View style={styles.detailInformationContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-calendar'
                size={22}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformationDate}>
                {moment(this.state.date).format('dddd Do MMMM')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-cash'
                size={22}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.price}</MuliText>
            </View>
            <MuliText style={styles.informationText}>
              <Ionicons
                name='ios-timer'
                size={22}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{moment.utc(this.state.startTime, 'HH:mm').format('HH:mm')} -
                          {moment.utc(this.state.endTime, 'HH:mm').format('HH:mm')}</MuliText>
            </MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-home'
                size={22}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.address}</MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-home'
                size={22}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.status}</MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>CHILDREN</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-happy"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                Number of children: {this.state.childrenNumber}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-heart-empty"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                Min age:{this.state.minAgeOfChildren}
              </MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>OPTIONS</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-cash'
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color='#bdc3c7'
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>In-app payment </MuliText>
                <MuliText style={styles.grayOptionInformation}>The parent pay via online payment</MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name='ios-car'
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color='#bdc3c7'
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>Lift</MuliText>
                <MuliText style={styles.grayOptionInformation}>The parent will take me home</MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name='ios-text'
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color='#bdc3c7'
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>VietNamese</MuliText>
                <MuliText style={styles.grayOptionInformation}>You need to speak at least one of these language</MuliText>
              </View>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>PARENT</MuliText>
            <View style={styles.detailPictureContainer}>
              <View>
                <Image source={this.state.detailPictureParent} style={styles.profileImg} ></Image>
                <View style={styles.name}>
                  <MuliText >{this.state.nameSitter}</MuliText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {this.state.invitationStatus == 'PENDING' &&
              <View>
                <TouchableOpacity style={styles.submitButton} onPress={() => this.onButtonClick("ACCEPTED")}>
                  <MuliText style={{ color: 'white', fontSize: 16 }}>Accept</MuliText>
                </TouchableOpacity>


                <TouchableOpacity style={styles.submitButton} onPress={() => this.onButtonClick("DENIED")}>
                  <MuliText style={{ color: 'white', fontSize: 16 }}>Decline</MuliText>
                </TouchableOpacity>
              </View>}

            {/* {this.state.isModalVisible ?
              (
                <Modal
                  isVisible={this.state.isModalVisible}
                  hasBackdrop={true} backdropOpacity={0.9}
                  onBackdropPress={this.toggleModal}
                  backdropColor='white'
                  onBackButtonPress={this.toggleModal}
                >
                  <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <MuliText style={{ color: '#707070', fontSize: 16 }}>Please input your Authentication Code</MuliText>
                    <View style={styles.textContainer}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.setState({ OTP: text })}
                        placeholder='Authentication code'
                        disableFullscreenUI={false}
                        value={this.state.OTP}
                        keyboardType='number-pad'
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.submitButton} onPress={this.onSubmitOTP}>
                        <MuliText style={{ color: 'white', fontSize: 16 }}>Submit</MuliText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )
              :
              (
                <View></View>
              )
            } */}
          </View>
        </View>
      </ScrollView>
    );
  }
}
InvitationDetail.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 50,
    marginTop: 20,
    marginHorizontal: 35,
    justifyContent: 'space-between',
  },
  detailContainer: {
    marginTop: 30,
  },
  name: {
    alignItems: "center"
  },
  submitButton: {
    width: 100,
    height: 50,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800'
  },
  optionsText: {
    fontSize: 20,
    color: "gray",
    fontWeight: 'bold',
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
  textAndDayContainer: {
    flexDirection: 'row',
  },
  informationText: {
    fontSize: 18,
    marginTop: 30,
    flexDirection: 'row',
    color: '#bdc3c7'
    // backgroundColor: 'red',
  },
  contentInformation: {
    fontSize: 15,
    paddingLeft: 15,
    color: '#315F61',
  },
  contentInformationDate: {
    fontSize: 15,
    paddingLeft: 15,
    color: '#315F61',
    fontWeight: '700'
  },
  priceText: {
    fontSize: 20,
    marginLeft: 150,
    marginTop: 30,
    flexDirection: 'row',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 10,
    marginLeft: 10,
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  optionText: {
    fontSize: 20,
    marginLeft: 50,
    marginTop: 30,
    flexDirection: 'row',
  },

  optionInformation: {
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: '400'
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 16,
    paddingLeft: 20,
    fontWeight: '200'
  },
  textOption: {
    marginHorizontal: 5,
  }
});
