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

  onButtonClick(targetStatus) {
    ivBody = {
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
                size={17}
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
                size={17}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.price}</MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-timer'
                size={17}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{moment.utc(this.state.startTime, 'HH:mm').format('HH:mm')} -
                          {moment.utc(this.state.endTime, 'HH:mm').format('HH:mm')}</MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-home'
                size={17}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.address}</MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-megaphone'
                size={17}
                style={{ marginBottom: -5 }}
                color='#bdc3c7'
              />
              <MuliText style={styles.contentInformation}>{this.state.status}</MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>CHILDREN</MuliText>
            <View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.childrenInformationContainer}>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                      <Ionicons
                        name='ios-man'
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color="#adffcb"
                      />
                      <View>
                        <MuliText style={{ marginLeft: 15, fontSize: 15 }}>2</MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>Number of children</MuliText>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                      <Ionicons
                        name='ios-happy'
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color="#adffcb"
                      />
                      <View>
                        <MuliText style={{ marginLeft: 15, fontSize: 15 }}>2</MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>Age of the youngest</MuliText>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>OPTIONS</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-cash'
                size={22}
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
                size={22}
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
                size={22}
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
            <View style={styles.detailPictureContainer}>
              <Image source={this.state.detailPictureParent} style={styles.profileImg} ></Image>
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>Parent</MuliText>
                <MuliText style={{ fontSize: 15 }}>Brody G.</MuliText>
              </View>
              <View style={styles.rightInformation}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity>
                    <Ionicons
                      name='ios-call'
                      size={22}
                      style={{ marginBottom: -5, marginHorizontal: 5 }}
                      color="#bdc3c7"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      name='ios-chatbubbles'
                      size={22}
                      style={{ marginBottom: -5, marginLeft: 10 }}
                      color="#adffcb"
                    />
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.buttonContainer}>
            {this.state.invitationStatus == 'PENDING' &&
              <View style={styles.buttonContainer}>

                <TouchableOpacity style={styles.submitButton} onPress={this.onButtonClick.bind(this, 'DENIED')}>
                  <MuliText style={{ color: 'red', fontSize: 15 }}>Decline</MuliText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={this.onButtonClick.bind(this, 'ACCEPTED')}>
                  <MuliText style={{ color: '#adffcb', fontSize: 15 }}>Accept</MuliText>
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
  title: "Invitation Detail"
};

const styles = StyleSheet.create({
  line: {
    borderWidth: 0,
    borderBottomWidth: 1,
    flex: 1,
    marginTop: 15,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
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
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 15,
  },
  leftInformation: {
    marginTop: 10,
    marginLeft: 10,
  },
  detailPictureContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
    marginHorizontal: 35,
    justifyContent: 'space-between',
  },
  detailContainer: {
    marginTop: 25,
  },
  submitButton: {
    width: 80,
    height: 30,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 5,
    fontWeight: '800'
  },
  optionsText: {
    fontSize: 15,
    color: "gray",
    fontWeight: 'bold',
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black"
  },
  textAndDayContainer: {
    flexDirection: 'row',
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7'
    // backgroundColor: 'red',
  },
  contentInformation: {
    fontSize: 10,
    paddingLeft: 10,
    color: '#315F61',
  },
  contentInformationDate: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#315F61',
    fontWeight: '700'
  },
  priceText: {
    fontSize: 15,
    marginLeft: 150,
    marginTop: 30,
    flexDirection: 'row',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 5,
    marginLeft: 5,
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 15,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 30,
    marginTop: 20,
    flexDirection: 'row',
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  optionInformation: {
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400'
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    paddingLeft: 15,
    fontWeight: '200',
    marginTop: 10,
  },
  textOption: {
    marginHorizontal: 5,
  }
});
