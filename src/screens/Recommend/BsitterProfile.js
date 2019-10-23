import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { MuliText } from 'components/StyledText';
import { Gender } from 'utils/Enum'
import { getProfileByRequest } from 'api/babysitter.api';
import { createInvitation } from 'api/invitation.api';

export default class BsitterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: 0,
      sitterId: 0,
      sitter: {},
      user: {},

    };
  }

  componentWillMount() {
    const sitterId = this.props.navigation.getParam('sitterId');
    const requestId = this.props.navigation.getParam('requestId');

    if (sitterId && sitterId != 0) {
      this.setState({ sitterId: sitterId, requestId: requestId }, () => this.getBabysitter());
    } else {
      console.log('Recommend/BsitterProfile - sitterId not found');
    }
  }

  getBabysitter = async () => {
    if (this.state.sitterId != 0 && this.state.requestId != 0) {
      const data = await getProfileByRequest(this.state.sitterId, this.state.requestId);
      this.setState({
        sitter: data,
        user: data.user,
      });

      return data;
    }
    return [];
  };

  sendInvitation = async (sitterId, requestId) => {
    console.log("Duong: BsitterProfile -> sendInvitation -> requestId", requestId)
    const invitation = {
      requestId: requestId,
      status: 'PENDING',
      receiver: sitterId,
    };
    console.log(invitation);
    await createInvitation(invitation)
      .then(() => {
        this.changeInviteStatus();
      })
      .catch((error) => console.log(error));
  };

  changeInviteStatus = () => {
    this.setState((prevState) => ({
      sitter: Object.assign(prevState.sitter, { isInvited: true })
    }));
  };

  // netstat -ano | findstr 3000
  render() {
    const { sitter } = this.state;
    const { user } = sitter;

    return (
      <View style={styles.container}>
        {this.state.sitter && (
          <View style={styles.sectionContainer}>
            <View style={styles.headerSection}>
              <MuliText
                style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
              >
                Thông tin cơ bản
              </MuliText>
            </View>
            <View>
              <MuliText style={styles.textField}>Tên: {this.state.user.nickname}</MuliText>
              <MuliText style={styles.textField}>Địa chỉ: {this.state.user.address}</MuliText>
              <MuliText style={styles.textField}>Giới tính: {this.state.user.gender == 'MALE' ? Gender.MALE: Gender.FEMALE}</MuliText>
            </View>
          </View>
        )}
        {this.state.sitter && (
          <View style={styles.sectionContainer}>
            <View style={styles.headerSection}>
              <MuliText
                style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
              >
                Yêu cầu làm việc
              </MuliText>
            </View>
            <View>
              <MuliText style={styles.textField}>Lịch rảnh: {this.state.sitter.weeklySchedule}</MuliText>
              <MuliText style={styles.textField}>Buổi sáng: {this.state.sitter.daytime}</MuliText>
              <MuliText style={styles.textField}>Buổi tối: {this.state.sitter.evening}</MuliText>
              <MuliText style={styles.textField}>
                Có thể trông trẻ tối thiểu: {this.state.sitter.minAgeOfChildren} tuổi
              </MuliText>
              <MuliText style={styles.textField}>
                Có thể trông tối đa: {this.state.sitter.maxNumOfChildren} trẻ
              </MuliText>
            </View>
            {this.state.sitter && (
              <View style={styles.buttonContainer}>
                {!this.state.sitter.isInvited && (
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={() =>
                      this.sendInvitation(this.state.sitter.userId, this.state.requestId)
                    }
                  >
                    <MuliText style={{ color: '#78ddb6', fontSize: 20 }}>
                      Mời
                    </MuliText>
                  </TouchableOpacity>
                )}
                {this.state.sitter.isInvited && (
                  <MuliText style={{ color: '#B81A1A', fontSize: 20 }}>
                    Đã mời
                  </MuliText>
                )}
              </View>
            )}
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
  sectionContainer: {
    backgroundColor: 'white',
    // flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  inviteButton: {
    marginTop: 10,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  textField: {
    marginBottom: 10,
    fontSize: 16,
  }
});
