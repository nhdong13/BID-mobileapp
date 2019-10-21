import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import Api from 'api/api_helper';
import { updateInvitation } from 'api/invitation.api';

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
      detailPictureParent: require('assets/images/Phuc.png'),
      parentName: 'Phuc',
      status: null,
      isModalVisible: false,
      invitationStatus: 'PENDING',
      childrenNumber: 1,
      minAgeOfChildren: 1,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await Api.get('invitations/' + this.state.invitationID.toString()).then(
      (resp) => {
        this.setState({
          parentName: resp.sittingRequest.user.nickname,
          invitationStatus: resp.status,
          date: resp.sittingRequest.sittingDate,
          startTime: resp.sittingRequest.startTime,
          endTime: resp.sittingRequest.endTime,
          address: resp.sittingRequest.sittingAddress,
          status: resp.sittingRequest.status,
        });
      },
    );
  };

  onLogin = () => {
    this.setState({ isModalVisible: true });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onButtonClick = (targetStatus) => {
    const ivBody = {
      id: this.state.invitationID,
      status: targetStatus,
    };
    updateInvitation(ivBody)
      .then(() => {
        this.props.navigation.navigate('Home', { loading: false });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <ScrollView>
        <View style={{ marginHorizontal: 30, backgroundColor: 'white' }}>
          <View style={styles.detailInformationContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-calendar"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformationDate}>
                {moment(this.state.date).format('dddd Do MMMM')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.price}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-timer"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {moment.utc(this.state.startTime, 'HH:mm').format('HH:mm')} -
                {moment.utc(this.state.endTime, 'HH:mm').format('HH:mm')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-home"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.address}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-megaphone"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.status}
              </MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>Trẻ em</MuliText>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.childrenInformationContainer}>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                      <Ionicons
                        name="ios-man"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color="#adffcb"
                      />
                      <View>
                        <MuliText style={{ marginLeft: 15, fontSize: 15 }}>
                          {this.state.childrenNumber}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Số trẻ
                    </MuliText>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                      <Ionicons
                        name="ios-happy"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color="#2ecc71"
                      />
                      <View>
                        <MuliText style={{ marginLeft: 15, fontSize: 15 }}>
                          {this.state.minAgeOfChildren}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Nhỏ tuổi nhất:
                    </MuliText>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>Chức năng khác</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={22}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>
                  Trả bằng thẻ{' '}
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Phụ huynh trả bằng thẻ
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-car"
                size={22}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>Đưa đón</MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Đón trẻ tại trường
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-text"
                size={22}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>Tiếng Việt</MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Bạn cần biết tiếng địa phương
                </MuliText>
              </View>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detailPictureContainer}>
              <Image
                source={this.state.detailPictureParent}
                style={styles.profileImg}
              />
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>Phụ huynh</MuliText>
                <MuliText style={{ fontSize: 15 }}>
                  {this.state.parentName}
                </MuliText>
              </View>
              <View style={styles.rightInformation}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity>
                    <Ionicons
                      name="ios-call"
                      size={22}
                      style={{ marginBottom: -5, marginHorizontal: 5 }}
                      color="#bdc3c7"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      name="ios-chatbubbles"
                      size={22}
                      style={{ marginBottom: -5, marginLeft: 10 }}
                      color="#2ecc71"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {this.state.invitationStatus == 'PENDING' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => this.onButtonClick('DENIED')}
                >
                  <MuliText style={{ color: 'red', fontSize: 15 }}>
                    Từ chối
                  </MuliText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => this.onButtonClick('ACCEPTED')}
                >
                  <MuliText style={{ color: '#2ecc71', fontSize: 15 }}>
                    Chấp nhận
                  </MuliText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}
InvitationDetail.navigationOptions = {
  title: 'Chi tiết lời mời',
};

const styles = StyleSheet.create({
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
    marginTop: 25,
    marginHorizontal: 35,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  detailContainer: {
    marginTop: 25,
  },
  submitButton: {
    width: 90,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    width: 90,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2ecc71',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 5,
    fontWeight: '800',
  },
  optionsText: {
    fontSize: 15,
    color: 'gray',
    fontWeight: 'bold',
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  textAndDayContainer: {
    flexDirection: 'row',
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  contentInformation: {
    fontSize: 10,
    paddingLeft: 15,
    color: '#315F61',
  },
  contentInformationDate: {
    fontSize: 12,
    paddingLeft: 15,
    color: '#315F61',
    fontWeight: '700',
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
    fontWeight: '400',
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
  },
});
