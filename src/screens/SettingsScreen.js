import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import logout from 'api/logout';
import Api from 'api/api_helper';
import { retrieveToken } from 'utils/handleToken';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  componentDidMount() {
    this.getDataAccordingToRole();
  }

  onLogout = async () => {
    logout()
      .then((res) => {
        // console.log(res);
        if (res) {
          this.props.navigation.navigate('Auth');
        }
      })
      .catch((error) => console.log(error));
  };

  getDataAccordingToRole = async () => {
    // check role of user parent - 1, bsitter - 2
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });

    await Api.get('users/' + this.state.userId.toString()).then((res) => {
      this.setState({ name: res.nickname });
      // console.log(res);
    });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.informationContainer} />
        <View style={{ marginHorizontal: 25, marginTop: 10 }}>
          <MuliText style={styles.headerTitle}>{this.state.name}</MuliText>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Profile')}
              style={styles.detailInformationContainer}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-switch"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Chi tiết tài khoản
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-home"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Đặc điểm ưu tiên
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-home"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Lịch trông trẻ
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CalendarScreen')}
              style={styles.detailInformationContainer}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-calendar"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>Lịch nghỉ</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-timer"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>Lịch sử</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Circle')}
              style={styles.detailInformationContainer}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-contacts"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Vòng tròn tin tưởng
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailInformationContainer}
              onPress={() => this.props.navigation.navigate('Payment')}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-cash"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Thanh toán
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginHorizontal: 25, marginTop: 20 }}>
          <MuliText style={styles.headerTitle}>Chức năng khác</MuliText>
          <View>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-settings"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>Tùy chỉnh</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-information-circle-outline"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Giúp đỡ và thông tin liên quan
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailInformationContainer}
              onPress={this.onLogout}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-log-out"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="red"
                />
                <MuliText style={styles.contentInformation}>Thoát</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  contentInformation: {
    fontSize: 15,
    paddingLeft: 15,
    color: '#315F61',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red'
  },
  informationText: {
    fontSize: 18,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    fontSize: 25,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  nameText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  viewProfileText: {
    fontSize: 15,
  },
  informationContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    marginTop: 35,
    // backgroundColor: 'red',
  },
  profileImg: {
    marginLeft: 'auto',
    width: 80,
    height: 80,
    borderRadius: 160 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
});
