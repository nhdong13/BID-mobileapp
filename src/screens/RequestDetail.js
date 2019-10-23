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
import colors from 'assets/Color';
import { listByRequestAndStatus } from 'api/invitation.api';
import { acceptBabysitter, cancelRequest } from 'api/sittingRequest.api';

export default class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId,
      date: null,
      startTime: null,
      endTime: null,
      address: null,
      price: '30/H',
      bsitter: null,
      status: null,
      invitations: [],
      childrenNumber: 1,
      minAgeOfChildren: 1,
    };
  }

  componentWillMount() {
    this.getAcceptedInvitations();
  }

  componentDidMount() {
    Api.get('sittingRequests/' + this.state.sittingRequestsID.toString()).then(
      (resp) => {
        this.setState({
          date: resp.sittingDate,
          startTime: resp.startTime,
          endTime: resp.endTime,
          address: resp.sittingAddress,
          status: resp.status,
          childrenNumber: resp.childrenNumber,
          minAgeOfChildren: resp.minAgeOfChildren,
          bsitter: resp.bsitter,
        });
      },
    );
  }

  onButtonClick = (targetStatus) => {
    const data = {
      id: this.state.sittingRequestsID,
      status: targetStatus,
    };

    cancelRequest(data)
      .then(() => {
        this.props.navigation.navigate('Home', { loading: false });
      })
      .catch((error) => console.log(error));
  };

  getAcceptedInvitations = async () => {
    const data = await listByRequestAndStatus(
      this.state.sittingRequestsID,
      'ACCEPTED',
    );

    this.setState({
      invitations: data,
    });
  };

  acceptBabysitter = async (sitterId) => {
    await acceptBabysitter(this.state.sittingRequestsID, sitterId);
    this.props.navigation.navigate('Home');
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
                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>
                          {this.state.childrenNumber}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Số trẻ:{' '}
                    </MuliText>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={{ flexDirection: 'row', marginTop: 25 }}>
                      <Ionicons
                        name="ios-happy"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color="#adffcb"
                      />
                      <View>
                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>
                          {this.state.minAgeOfChildren}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Nhỏ tuổi nhất:{' '}
                    </MuliText>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>Tùy chọn khác</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={22}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>
                  Trả bằng thẻ
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Thẻ tùy vào người giữ trẻ
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
                <MuliText style={styles.optionInformation}>
                  Người giữ trẻ không có xe
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Tôi sẽ đưa người giữ trẻ về nhà
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
                  Tôi muốn người giữ trẻ nói tiếng địa phương
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-man"
                size={22}
                style={{ marginBottom: -5, marginHorizontal: 10 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>Bảo hiểm</MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Tôi không có bảo hiểm
                </MuliText>
              </View>
            </View>
          </View>

          {/* render babysitter if exist */}
          {this.state.bsitter ? (
            <View style={styles.detailPictureContainer}>
              <Image
                source={this.state.detailPictureSitter}
                style={styles.profileImg}
              />
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>
                  Người giữ trẻ
                </MuliText>
                <MuliText style={{ fontSize: 15 }}>
                  {this.state.bsitter.nickname}
                </MuliText>
              </View>
            </View>
          ) : (
            <View style={styles.detailContainer} />
          )}
          {/* end */}
          {/*  Confirm a sitter */}

          {this.state.status == 'PENDING' &&
            this.state.bsitter == null &&
            this.state.invitations.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.headerSection}>
                  <MuliText style={styles.headerTitle}>
                    Xác nhận người giữ trẻ
                  </MuliText>
                </View>
                <ScrollView>
                  {this.state.invitations &&
                    this.state.invitations != [] &&
                    this.state.invitations.map((item) => (
                      <View key={item.id} style={styles.detailPictureContainer}>
                        <Image
                          source={this.state.detailPictureSitter}
                          style={styles.profileImg}
                        />
                        <View style={styles.leftInformationSitter}>
                          <MuliText style={styles.pictureInformationSitter}>
                            Người giữ trẻ
                          </MuliText>
                          <MuliText style={{ fontSize: 15 }}>
                            {item.user.nickname}
                          </MuliText>
                          <View style={styles.lowerText}>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons
                                name="ios-pin"
                                size={17}
                                style={{ marginBottom: 2 }}
                                color={colors.lightGreen}
                              />
                              <MuliText style={{ marginLeft: 3 }}>
                                {item.user.babysitter.distance} km
                              </MuliText>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons
                                name="ios-star"
                                size={17}
                                style={{ marginBottom: 2, marginLeft: 5 }}
                                color={colors.lightGreen}
                              />
                              <MuliText style={{ marginLeft: 3 }}>
                                {item.user.babysitter.averageRating}
                              </MuliText>
                            </View>
                          </View>
                        </View>
                        <View style={styles.rightInformationSitter}>
                          <View>
                            {/* <TouchableOpacity style={styles.inviteButton} >
                          <MuliText style={{ color: "#78ddb6", fontSize: 16 }}>
                            Decline
                          </MuliText>
                        </TouchableOpacity> */}
                            <TouchableOpacity
                              style={styles.inviteButton}
                              onPress={() =>
                                this.acceptBabysitter(item.user.id)
                              }
                            >
                              <MuliText
                                style={{ color: '#78ddb6', fontSize: 11 }}
                              >
                                Chấp nhận
                              </MuliText>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                </ScrollView>
              </View>
            )}
          {/*  End Confirm a sitter */}

          {/* render button according status */}

          <View style={styles.buttonContainer}>
            {this.state.status == 'PENDING' && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.onButtonClick('CANCELED')}
              >
                <MuliText style={{ color: '#e74c3c', fontSize: 11 }}>
                  Hủy
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.status == 'CONFIRMED' && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.onButtonClick('ONGOING');
                  this.props.navigation.navigate('Home');
                }}
              >
                <MuliText style={{ color: '#2ecc71', fontSize: 12 }}>
                  Người giữ trẻ Check-in
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.status == 'ONGOING' && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  this.onButtonClick('DONE');
                  this.props.navigation.navigate('Home');
                }}
              >
                <MuliText style={{ color: '#8e44ad', fontSize: 11 }}>
                  Xác nhận công việc hoàn thành
                </MuliText>
              </TouchableOpacity>
            )}
          </View>
          {this.state.status == 'ACCEPTED' || this.state.status == 'DENIED' ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: '#2ecc71', fontSize: 11 }}>
                  Chấp nhận
                </MuliText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: '#e74c3c', fontSize: 11 }}>
                  Từ chối
                </MuliText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.listBabySitterButton}
                onPress={() => {
                  this.props.navigation.navigate('Recommend', {
                    requestId: this.state.sittingRequestsID,
                  });
                }}
              >
                <MuliText style={{ color: '#8e44ad', fontSize: 13 }}>
                  Danh sách người giữ trẻ
                </MuliText>
              </TouchableOpacity>
            </View>
          )}

          {/* end */}
        </View>
      </ScrollView>
    );
  }
}
RequestDetail.navigationOptions = {
  title: 'Request Detail',
};

const styles = StyleSheet.create({
  rightInformationSitter: {
    marginLeft: 'auto',
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 15,
  },
  pictureInformationSitter: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  leftInformationSitter: {
    marginLeft: 10,
  },
  leftInformation: {
    marginTop: 10,
    marginLeft: 10,
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
  lowerText: {
    flexDirection: 'row',
  },
  sectionContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 20,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
  },
  inviteButton: {
    flex: 1,
    width: 100,
    height: 30,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 50,
  },
  bsitterName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#315F61',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  sitterImage: {
    width: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
    marginLeft: 50,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  listBabySitterButton: {
    marginVertical: 10,
    width: '100%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  detailContainer: {
    marginTop: 20,
  },
  name: {
    alignItems: 'center',
  },
  submitButton: {
    width: 80,
    height: 30,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    marginHorizontal: 10,
    backgroundColor: '#315F61',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
    marginLeft: 5,
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
    fontSize: 12,
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
    marginTop: 10,
    marginHorizontal: 5,
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 50,
    marginTop: 30,
    flexDirection: 'row',
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
