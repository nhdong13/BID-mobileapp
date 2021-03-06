import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import logout from 'api/logout';
import Api from 'api/api_helper';
import { retrieveToken } from 'utils/handleToken';
import colors from 'assets/Color';

export default class ParentSetting extends Component {
  constructor(props) {
    super(props);
    this.state = { nickname: '', image: null };
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
      const { nickname, image } = res;
      this.setState({ nickname: nickname, image: image });
      // console.log(res);
    });
  };

  render() {
    const { nickname, image } = this.state;
    return (
      <ScrollView>
        <View style={{ alignItems: 'center', marginTop: 25 }}>
          <Image source={{ uri: image }} style={styles.picture} />
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <MuliText style={styles.headerTitle}>{nickname}</MuliText>
            <MuliText style={styles.blueOptionInformation}>Phụ huynh</MuliText>
          </View>
        </View>
        <View style={styles.informationContainer}>
          <MuliText style={styles.headerTitleGray}>
            Thông tin tài khoản
          </MuliText>
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
                  color={colors.gray}
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
                  color={colors.gray}
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
                  color={colors.gray}
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
                  color={colors.gray}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailInformationContainer}
              onPress={() => this.props.navigation.navigate('SittingHistory')}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-timer"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color={colors.gray}
                />
                <MuliText style={styles.contentInformation}>Lịch sử</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color={colors.gray}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailInformationContainer}
              onPress={() => this.props.navigation.navigate('RepeatedRequest')}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-timer"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color={colors.gray}
                />
                <MuliText style={styles.contentInformation}>
                  Lịch lặp lại
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color={colors.gray}
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
                  color={colors.gray}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

ParentSetting.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  blueOptionInformation: {
    color: colors.blueAqua,
    fontSize: 13,
    fontWeight: '200',
  },
  headerTitleGray: {
    marginTop: 10,
    fontSize: 13,
    color: colors.gray,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  picture: {
    width: 80,
    height: 80,
    marginTop: 45,
    borderRadius: 80 / 2,
    overflow: 'hidden',
  },
  contentInformation: {
    fontSize: 15,
    paddingLeft: 15,
    color: colors.darkGreenTitle,
  },
  detailInformationContainer: {
    marginLeft: 15,
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  informationText: {
    fontSize: 18,
    flexDirection: 'row',
    color: colors.grays,
  },
  informationContainer: {
    marginHorizontal: 25,
    marginTop: 15,
  },
});
