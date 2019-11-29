/* eslint-disable react/no-unused-state */
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
import localization from 'moment/locale/vi';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import { updateInvitation } from 'api/invitation.api';
import { formater } from 'utils/MoneyFormater';

moment.updateLocale('vi', localization);

export default class InvitationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationID: this.props.navigation.state.params.invitationId,
      date: '2019-10-03',
      startTime: '12:00 AM',
      endTime: '3:00 AM',
      address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
      price: 0,
      detailPictureParent: require('assets/images/Phuc.png'),
      parentName: 'Phuc',
      status: null,
      isModalVisible: false,
      invitationStatus: 'PENDING',
      childrenNumber: 1,
      minAgeOfChildren: 1,
      createUserId: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await Api.get('invitations/' + this.state.invitationID.toString()).then(
      (resp) => {
        console.log('PHUC: InvitationDetail -> getData -> resp', resp);
        this.setState({
          createUserId: resp.sittingRequest.user.id,
          parentName: resp.sittingRequest.user.nickname,
          invitationStatus: resp.status,
          date: resp.sittingRequest.sittingDate,
          startTime: resp.sittingRequest.startTime,
          endTime: resp.sittingRequest.endTime,
          address: resp.sittingRequest.sittingAddress,
          status: resp.sittingRequest.status,
          price: resp.sittingRequest.totalPrice,
          childrenNumber: resp.sittingRequest.childrenNumber,
          minAgeOfChildren: resp.sittingRequest.minAgeOfChildren,
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

  callDetail() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

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
                color={colors.gray}
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
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {formater(this.state.price)} VND
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-timer"
                size={17}
                style={{ marginBottom: -5 }}
                color={colors.gray}
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
                color={colors.gray}
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
                color={colors.gray}
              />
              <MuliText style={styles.contentInformation}>
                {this.state.invitationStatus == 'PENDING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'ACCEPTED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.lightGreen }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'DONE' && (
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'ONGOING' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.ongoing }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'EXPIRED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'CONFIRMED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.confirmed }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'SITTER_NOT_CHECKIN' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
                {this.state.invitationStatus == 'PARENT_CANCELED' && (
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {this.state.invitationStatus}
                  </MuliText>
                )}
              </MuliText>
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
                      name="ios-chatbubbles"
                      size={22}
                      style={{ marginBottom: -5, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                  </TouchableOpacity>
                </View>
              </View>
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
                    <View style={styles.detailChildrenContainer}>
                      <Ionicons
                        name="ios-man"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color={colors.lightGreen}
                      />
                      <View>
                        <MuliText style={styles.textChildrenInformation}>
                          {this.state.childrenNumber}
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Số trẻ
                    </MuliText>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={styles.detailChildrenContainer}>
                      <Ionicons
                        name="ios-happy"
                        size={22}
                        style={{ marginBottom: -5, marginLeft: 15 }}
                        color={colors.lightGreen}
                      />
                      <View>
                        <MuliText style={styles.textChildrenInformation}>
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
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.callDetail();
              }}
              title="Show more detail"
              style={{ marginLeft: 10 }}
            >
              <MuliText style={{ color: colors.blueAqua }}>
                {this.state.isModalVisible ? 'Ẩn đi' : 'Xem thêm'}
              </MuliText>
            </TouchableOpacity>
            {this.state.isModalVisible && (
              <View>
                <View style={styles.detailContainer}>
                  <MuliText style={styles.headerTitle}>Chức năng khác</MuliText>
                  <View style={styles.informationText}>
                    <Ionicons
                      name="ios-cash"
                      size={22}
                      style={{ marginBottom: -5, marginHorizontal: 5 }}
                      color={colors.gray}
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
                      color={colors.gray}
                    />
                    <View style={styles.textOption}>
                      <MuliText style={styles.optionInformation}>
                        Đưa đón
                      </MuliText>
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
                      color={colors.gray}
                    />
                    <View style={styles.textOption}>
                      <MuliText style={styles.optionInformation}>
                        Tiếng Việt
                      </MuliText>
                      <MuliText style={styles.grayOptionInformation}>
                        Bạn cần biết tiếng địa phương
                      </MuliText>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {this.state.invitationStatus == 'PENDING' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => this.onButtonClick('DENIED')}
                >
                  <MuliText style={{ color: colors.canceled, fontSize: 15 }}>
                    Từ chối
                  </MuliText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => this.onButtonClick('ACCEPTED')}
                >
                  <MuliText style={{ color: colors.done, fontSize: 15 }}>
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
  detailChildrenContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  textChildrenInformation: {
    marginLeft: 15,
    fontSize: 15,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 80,
    width: 140,
    elevation: 2,
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  leftInformation: {
    marginTop: 5,
    marginLeft: 5,
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
    marginVertical: 15,
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
    width: 100,
    height: 35,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.done,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 5,
    fontWeight: '800',
  },

  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  informationText: {
    fontSize: 13,
    marginTop: 15,
    flexDirection: 'row',
    color: colors.gray,
  },
  contentInformation: {
    fontSize: 10,
    paddingLeft: 10,
    color: colors.darkGreenTitle,
  },
  contentInformationDate: {
    fontSize: 12,
    paddingLeft: 10,
    color: colors.darkGreenTitle,
    fontWeight: '700',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 5,
    marginLeft: 5,
  },

  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray,
  },
  optionInformation: {
    fontSize: 13,
    paddingLeft: 10,
    fontWeight: '400',
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    paddingLeft: 10,
    fontWeight: '200',
    marginTop: 5,
  },
  textOption: {
    marginHorizontal: 5,
  },
});
