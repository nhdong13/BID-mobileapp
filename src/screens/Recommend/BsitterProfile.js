import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { MuliText } from 'components/StyledText';
import { getProfile } from 'api/babysitter.api';

export default class BsitterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sitterId: 0,
      sitter: {},
      user: {},
    };
  }

  componentWillMount() {
    const sitterId = this.props.navigation.getParam('sitterId');
    if (sitterId && sitterId != 0) {
      this.setState({ sitterId: sitterId }, () => this.getBabysitter());
    } else {
      console.log('Recommend/BsitterProfile - sitterId not found');
    }
  }

  getBabysitter = async () => {
    if (this.state.sitterId != 0) {
      const data = await getProfile(this.state.sitterId);
      this.setState({
        sitter: data,
        user: data.user,
      });

      return data;
    }
    return [];
  };

  // netstat -ano | findstr 3000
  render() {
    const { sitter } = this.state;
    const { user } = sitter;

    return (
      <View style={styles.container}>
        {this.state.sitter != undefined && (
          <View style={styles.basic}>
            <View style={styles.headerSection}>
              <MuliText
                style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
              >
                Thông tin cơ bản
              </MuliText>
            </View>
            <View>
              <MuliText>Tên: {this.state.user.nickname}</MuliText>
              <MuliText>Địa chỉ: {this.state.user.address}</MuliText>
              <MuliText>Giới tính: {this.state.user.gender}</MuliText>
            </View>
          </View>
        )}
        {this.state.sitter != undefined && (
          <View style={styles.sittingReferences}>
            <View style={styles.headerSection}>
              <MuliText
                style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
              >
                Yêu cầu làm việc
              </MuliText>
            </View>
            <View>
              <MuliText>Lịch rảnh: {this.state.sitter.weeklySchedule}</MuliText>
              <MuliText>Buổi sáng: {this.state.sitter.daytime}</MuliText>
              <MuliText>Buổi tối: {this.state.sitter.evening}</MuliText>
              <MuliText>
                Tuổi tối thiếu: {this.state.sitter.minAgeOfChildren}
              </MuliText>
              <MuliText>
                Số lượng trẻ tối đa: {this.state.sitter.maxNumOfChildren}
              </MuliText>
            </View>
          </View>
        )}
      </View>
    );
  }
}

// RecommendScreen.navigationOptions = {
//   title: 'Đề nghị người giữ trẻ',
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    paddingBottom: 20,
  },
  textInput: {
    borderColor: '#EEEEEE',
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: 'muli',
  },
  sectionContainer: {
    backgroundColor: 'white',
    // flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 60,
    alignItems: 'center',
    marginBottom: 15,
  },
  bsitterContainer: {
    marginTop: 20,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  lowerText: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    marginTop: 10,
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#315F61',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
