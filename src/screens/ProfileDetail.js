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
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import Api from 'api/api_helper';
import colors from 'assets/Color';

export default class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      roleId: 1,
      // eslint-disable-next-line react/no-unused-state
      user: null,
      name: '',
      address: '',
      gender: 'MALE',
      dob: null,
      child: null,
      bsitter: null,
    };
  }

  componentDidMount() {
    this.getDataAccordingToRole();
  }

  getDataAccordingToRole = async () => {
    // check role of user parent - 1, bsitter - 2
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
    });

    await Api.get('users/' + this.state.userId.toString()).then((res) => {
      this.setState({
        address: res.address,
        name: res.nickname,
        gender: res.gender,
        dob: res.dateOfBirth,
      });
      // eslint-disable-next-line no-unused-expressions
      this.state.roleId == 2
        ? this.setState({ child: res.parent.children })
        : this.setState({ child: null });
      // eslint-disable-next-line no-unused-expressions
      this.state.roleId == 3
        ? this.setState({ bsitter: res.babysitter })
        : this.setState({ bsitter: null });
    });
  };

  render() {
    return (
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 25,
            marginTop: 25,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <MuliText style={{ marginLeft: 10 }}>
                {this.state.name} - {moment().diff(this.state.dob, 'years')} -
              </MuliText>
              <Ionicons
                name={this.state.gender == 'MALE' ? 'ios-male' : 'ios-female'}
                size={20}
                style={{ marginLeft: 5 }}
                color={
                  this.state.gender == 'MALE'
                    ? colors.blueAqua
                    : colors.pinkLight
                }
              />
            </View>
            {/* <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons
                                    name="ios-pin"
                                    size={20}
                                    style={{ marginLeft: 10 }}
                                    color={colors.lightGreen}
                                />
                                <MuliText style={{ marginLeft: 3 }}> Distance km </MuliText>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons
                                    name="ios-star"
                                    size={20}
                                    style={{ marginLeft: 7 }}
                                    color={colors.lightGreen}
                                />
                                <MuliText> Rating </MuliText>
                            </View>
                        </View> */}
          </View>
          <TouchableOpacity
            style={{
              alignContent: 'center',
              marginLeft: 'auto',
              marginTop: 10,
            }}
          >
            <Ionicons
              name="ios-heart-empty"
              size={30}
              color={colors.lightGreen}
            />
            <MuliText style={{ color: colors.lightGreen }}>Like </MuliText>
          </TouchableOpacity>
        </View>
        <MuliText style={{ marginHorizontal: 25, marginTop: 10 }}>
          Địa chỉ: {this.state.address}
        </MuliText>
        {this.state.bsitter != null ? (
          <View>
            <MuliText style={{ marginHorizontal: 25, marginTop: 10 }}>
              Ngày làm việc: {this.state.bsitter.weeklySchedule}
            </MuliText>
            <MuliText style={{ marginHorizontal: 25, marginTop: 10 }}>
              Thời gian làm việc: {this.state.bsitter.daytime} and{' '}
              {this.state.bsitter.evening}
            </MuliText>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.line} />

        {/* ba
            by
            sit
            ter de
            tail
        */}
        {this.state.roleId == 3 && (
          <View>
            {/* description */}
            <View
              style={{
                marginHorizontal: 25,
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="ios-person-add"
                  size={20}
                  color={colors.lightGreen}
                />
                <MuliText> 4 lượt giữ trẻ </MuliText>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons
                  name="ios-chatbubbles"
                  size={20}
                  color={colors.lightGreen}
                  style={{ marginLeft: 10 }}
                />
                <MuliText> 3 đánh giá </MuliText>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                marginHorizontal: 25,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  resizeMode="stretch"
                  source={this.state.detailPictureChildren}
                  style={styles.profileImg2}
                />
                <Image
                  resizeMode="stretch"
                  source={this.state.detailPictureChildren}
                  style={styles.profileImg2}
                />
              </View>
              <MuliText style={{ marginTop: 10 }}>
                Bla bla bla bla bla bla Bla bla bla bla bla blaBl a bla bla bla
                bla blaBla bla bla bla bla blaBla bla bla bla bla bla
              </MuliText>
            </View>
            <View style={styles.line} />

            {/* tùy chọn */}
            <View style={styles.detailContainer}>
              <MuliText style={styles.headerTitle}>Tùy chọn</MuliText>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-cash"
                  size={22}
                  style={{ marginBottom: -5, marginHorizontal: 5 }}
                  color={colors.gray}
                />
                <View style={styles.textOption}>
                  <MuliText style={styles.optionInformation}>
                    Thanh toán bằng thẻ
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
                    Người giữ trẻ không có xe
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
                    Có thể nói được tiếng Việt, tiếng Anh
                  </MuliText>
                </View>
              </View>

              <View style={styles.informationText}>
                <Ionicons
                  name="ios-man"
                  size={22}
                  style={{ marginBottom: -5, marginHorizontal: 10 }}
                  color={colors.gray}
                />
                <View style={styles.textOption}>
                  <MuliText style={styles.optionInformation}>
                    Có lí lịch trong sạch
                  </MuliText>
                </View>
              </View>
            </View>
            {/* kỹ năng */}
            <View style={styles.detailContainer}>
              <MuliText style={styles.headerTitle}>Kỹ năng</MuliText>
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
                          1
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Chém gió
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
                          2
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Chăm sóc trẻ khi bị bệnh
                    </MuliText>
                  </View>
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
                          3
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Dạy học cho trẻ
                    </MuliText>
                  </View>
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
                          4
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Nấu ăn cực ngon
                    </MuliText>
                  </View>
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
                          5
                        </MuliText>
                      </View>
                    </View>
                    <MuliText style={styles.grayOptionInformation}>
                      Hài hước
                    </MuliText>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.line} />
            <View style={styles.detailContainer}>
              <MuliText style={styles.headerTitle}>Đánh giá</MuliText>

              <View style={styles.reivewContainer}>
                <Image
                  source={this.state.detailPictureSitter}
                  style={styles.profileImg}
                />
                <View>
                  <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                    <MuliText style={styles.nameReview}>Dương</MuliText>
                    <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                    <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                      <MuliText> 3 </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={20}
                        style={{ marginLeft: 2 }}
                        color={colors.lightGreen}
                      />
                    </View>
                  </View>
                  <View style={styles.textReview}>
                    <MuliText numberOfLines={3}>
                      Chỉnh sửa api google, Làm con tôi té, trừ điểm
                    </MuliText>
                  </View>
                </View>
              </View>
              <View style={styles.reivewContainer}>
                <Image
                  source={this.state.detailPictureSitter}
                  style={styles.profileImg}
                />
                <View>
                  <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                    <MuliText style={styles.nameReview}>Đông</MuliText>
                    <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                    <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                      <MuliText> 5 </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={20}
                        style={{ marginLeft: 2 }}
                        color={colors.lightGreen}
                      />
                    </View>
                  </View>
                  <View style={styles.textReview}>
                    <MuliText numberOfLines={3}>Đẹp trai</MuliText>
                  </View>
                </View>
              </View>
              <View style={styles.reivewContainer}>
                <Image
                  source={this.state.detailPictureSitter}
                  style={styles.profileImg}
                />
                <View>
                  <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                    <MuliText style={styles.nameReview}>Kỳ</MuliText>
                    <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                    <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                      <MuliText> 5 </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={20}
                        style={{ marginLeft: 2 }}
                        color={colors.lightGreen}
                      />
                    </View>
                  </View>
                  <View style={styles.textReview}>
                    <MuliText numberOfLines={3}>
                      Nuôi trẻ mập còn hơn ba nó
                    </MuliText>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* e
            n
            d
            baby
            sit
            ter
        */}

        {/* pa
            re
            nt
            de
            tail
        */}
        {this.state.roleId == 2 && (
          <View style={styles.detailContainer}>
            {this.state.child != null ? (
              <View>
                <MuliText style={styles.headerTitle}>
                  Số lượng trẻ: {this.state.child.length}
                </MuliText>
                <View style={styles.detailPictureContainer}>
                  {this.state.child.map((item) => (
                    <View key={item.id}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.profileImg}
                      />
                      <View style={styles.name}>
                        <MuliText>
                          {item.name} - {item.age} year olds
                        </MuliText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
        {/* e
            n
            d
            pa
            rent
            de
            tail */}
      </ScrollView>
    );
  }
}
ProfileDetail.navigationOptions = {
  title: 'Profile detail',
};

const styles = StyleSheet.create({
  name: {
    alignItems: 'center',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textReview: {
    marginLeft: 8,
    marginRight: 100,
    flex: 1,
  },
  line: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  reivewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameReview: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#315F61',
  },
  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  textOption: {
    marginHorizontal: 5,
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg2: {
    width: 60,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
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
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    paddingLeft: 15,
    fontWeight: '200',
    marginTop: 10,
  },
});
