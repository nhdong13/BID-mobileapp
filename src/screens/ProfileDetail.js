import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  // TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      code: null,
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
        ? this.setState({
            child: res.parent.children,
            code: res.parent.parentCode,
          })
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
        <View>
          <View style={{ marginTop: 15, alignItems: 'center' }}>
            <MuliText style={styles.headerTitle}>Hồ sơ</MuliText>
            <MuliText style={styles.grayOptionInformation}>
              Hồ sơ cá nhân của bạn
            </MuliText>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
            <Image
              source={require('assets/images/Phuc.png')}
              style={styles.picture}
            />
            <View
              style={{
                marginTop: 10,
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <MuliText style={{ marginLeft: 10 }}>
                {this.state.name} - {moment().diff(this.state.dob, 'years')}{' '}
                tuổi -
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
            {this.state.bsitter != null && (
              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <MuliText style={{ marginLeft: 10 }}>
                  Được đánh giá: (Số sao)
                </MuliText>
                <Ionicons
                  name="ios-star"
                  size={20}
                  style={{ marginLeft: 5 }}
                  color={colors.done}
                />
              </View>
            )}
            <MuliText style={styles.textDetail}>
              Địa chỉ: {this.state.address}
            </MuliText>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: colors.gray,
            borderBottomWidth: 1,
            marginHorizontal: 30,
            marginTop: 20,
          }}
        />
        {this.state.bsitter != null ? (
          <View>
            <View style={{ marginHorizontal: 30 }}>
              <MuliText style={{ fontSize: 15, marginTop: 20 }}>
                Ngày làm việc: {this.state.bsitter.weeklySchedule}
              </MuliText>
              <MuliText
                style={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}
              >
                Giờ làm việc từ:
              </MuliText>
              <MuliText>
                Buổi sáng:
                {moment
                  .utc(this.state.bsitter.daytime, 'HH:mm')
                  .format(' HH giờ đến mm giờ ')}
              </MuliText>
              <MuliText>
                Buổi chiều:
                {moment
                  .utc(this.state.bsitter.evening, 'HH:mm')
                  .format(' HH giờ đến mm giờ')}
              </MuliText>
              <View style={styles.detailContainerFeedback}>
                <MuliText style={styles.headerTitle}>
                  Phản hồi từ phụ huynh
                </MuliText>
              </View>
            </View>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.childrenInformationContainer}>
                    <View style={styles.detailChildrenContainer}>
                      <Image
                        source={require('assets/images/Phuc.png')}
                        style={styles.pictureFeedback}
                      />
                      <View style={{ marginRight: 10 }}>
                        <MuliText style={styles.textChildrenInformation}>
                          Name
                        </MuliText>
                        <MuliText style={{ color: colors.gray }}>
                          Đã đánh giá: (5)
                          <Ionicons
                            name="ios-star"
                            size={20}
                            color={colors.done}
                          />
                        </MuliText>
                        <MuliText
                          numberOfLines={3}
                          ellipsizeMode="tail"
                          style={{ color: colors.gray, width: 150 }}
                        >
                          Text feedback sdasadasdsadsdasdasdajljlkjljlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkjlkj
                        </MuliText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.childrenInformationContainer}>
                    <View style={styles.detailChildrenContainer}>
                      <Image
                        source={require('assets/images/Phuc.png')}
                        style={styles.pictureFeedback}
                      />
                      <View>
                        <MuliText style={styles.textChildrenInformation}>
                          Name
                        </MuliText>
                        <MuliText style={{ color: colors.gray }}>
                          Đã đánh giá: (5)
                          <Ionicons
                            name="ios-star"
                            size={20}
                            color={colors.done}
                          />
                        </MuliText>
                        <MuliText style={{ color: colors.gray }}>
                          Text feedback
                        </MuliText>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : (
          <View />
        )}
        {this.state.roleId == 2 && (
          <View style={styles.detailContainer}>
            <MuliText style={styles.textDetailCode}>
              Mã cá nhân: {this.state.code ? this.state.code : 'Chưa có'}
            </MuliText>
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
                        <MuliText>{item.name}</MuliText>
                        <MuliText>{item.age} tuổi</MuliText>
                      </View>
                    </View>
                  ))}
                </View>
                {!this.state.code && (
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity
                      style={styles.barcode}
                      onPress={() =>
                        this.props.navigation.navigate('CreateCodeScreen', {
                          userId: this.state.userId,
                        })
                      }
                    >
                      <MuliText style={{ color: colors.done }}>
                        Tạo mã cá nhân
                      </MuliText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}
ProfileDetail.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  textChildrenInformation: {
    fontSize: 15,
  },
  detailChildrenContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 150,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 5,
    fontWeight: '800',
  },
  starContainer: {
    marginLeft: 10,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  pictureFeedback: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    overflow: 'hidden',
  },
  picture: {
    width: 100,
    height: 100,
    marginTop: 15,
    borderRadius: 100 / 2,
    overflow: 'hidden',
  },
  informationContainer: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  sitterImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: '200',
  },
  textDetailCode: {
    marginBottom: 5,
  },
  textDetailDayOFf: {
    fontSize: 15,
    marginTop: 20,
  },
  textDetail: {
    fontSize: 15,
    marginTop: 20,
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  barcode: {
    width: 150,
    height: 35,
    padding: 5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.done,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  name: {
    alignItems: 'center',
  },
  detailPictureContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  detailContainer: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  detailContainerFeedback: {
    marginVertical: 20,
  },
});
