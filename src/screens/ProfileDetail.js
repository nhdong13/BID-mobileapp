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
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <MuliText style={{ marginLeft: 25 }}>
              {this.state.name} - {moment().diff(this.state.dob, 'years')} -
            </MuliText>
            <Ionicons
              name={this.state.gender == 'MALE' ? 'ios-male' : 'ios-female'}
              size={20}
              style={{ marginLeft: 5 }}
              color={
                this.state.gender == 'MALE' ? colors.blueAqua : colors.pinkLight
              }
            />
          </View>
          <MuliText style={styles.textDetail}>
            Mã cá nhân: {this.state.code ? this.state.code : 'Chưa có'}
          </MuliText>
        </View>
        <MuliText style={styles.textDetail}>
          Địa chỉ: {this.state.address}
        </MuliText>
        {this.state.bsitter != null ? (
          <View>
            <MuliText style={styles.textDetail}>
              Ngày làm việc: {this.state.bsitter.weeklySchedule}
            </MuliText>
            <MuliText style={styles.textDetail}>
              Thời gian làm việc: {this.state.bsitter.daytime} and{' '}
              {this.state.bsitter.evening}
            </MuliText>
          </View>
        ) : (
          <View />
        )}
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
                        <MuliText>{item.name}</MuliText>
                        <MuliText>{item.age} tuổi</MuliText>
                      </View>
                    </View>
                  ))}
                </View>
                {/* {!this.state.code && ( */}
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
                {/* )} */}
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
  title: 'Chi tiết hồ sơ',
};

const styles = StyleSheet.create({
  textDetail: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: '200',
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
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
    justifyContent: 'space-between',
  },

  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
});
