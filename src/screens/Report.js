/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import Api from 'api/api_helper';
import { retrieveToken } from 'utils/handleToken';
import { Ionicons } from '@expo/vector-icons';

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId,
      bsitter: null,
      user: null,
      isModalVisible: false,
      starCount: 0,
      isRated: false,
      description: '',
      roleId: 2,
    };
  }

  async componentDidMount() {
    await retrieveToken().then((res) => {
      const { roleId } = res;
      this.setState({ roleId });
    });
    await Api.get(
      'sittingRequests/' + this.state.sittingRequestsID.toString(),
    ).then((resp) => {
      this.setState({
        date: resp.sittingDate,
        startTime: resp.startTime,
        endTime: resp.endTime,
        address: resp.sittingAddress,
        bsitter: resp.bsitter,
        price: resp.totalPrice,
        user: resp.user,
      });
    });
    await Api.get('feedback/' + this.state.sittingRequestsID.toString()).then(
      (res) => {
        if (res != null) {
          const tmp = this.state.roleId == 2 ? 3 : 4;
          res.map((item, index) => {
            if (item.order == tmp) {
              this.setState({
                starCount: res[index].rating,
                isRated: true,
                description: res[index].description,
              });
            }
          });
        }
        // if (
        //   res != null &&
        //   res[0].reporter == (this.state.roleId == 2) &&
        //   res[0].isReport == true
        // ) {
        //   this.setState({
        //     starCount: res[0].rating,
        //     isRated: true,
        //     description: res[0].description,
        //   });
        // }
      },
    );
  }

  onStarRatingPress(rating) {
    if (!this.state.isRated) {
      this.setState({ starCount: rating });
    }
  }

  submitRating = () => {
    const { starCount, sittingRequestsID, description, roleId } = this.state;
    const body = {
      rating: starCount,
      requestId: sittingRequestsID,
      description: description,
      isReport: true,
      reporter: roleId == 2,
      status: 'Unsolve',
      order: roleId == 2 ? 3 : 4,
    };

    if (!this.state.isRated && description != '') {
      Api.post('feedback/', body);
      this.setState({ isRated: true });
      this.props.navigation.navigate('Home');
    }
  };

  callDetail() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  render() {
    const { isRated, description } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={60}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <ScrollView>
            <View style={styles.header} />
            <Image
              source={require('assets/images/Phuc.png')}
              style={styles.avatar}
            />
            <View style={{ alignItems: 'center' }}>
              {this.state.roleId == 2 && this.state.bsitter && (
                <MuliText
                  style={{ fontWeight: 'bold', fontSize: 25, marginTop: 60 }}
                >
                  {this.state.bsitter.nickname}
                </MuliText>
              )}
              {this.state.roleId == 3 && this.state.user && (
                <MuliText
                  style={{ fontWeight: 'bold', fontSize: 25, marginTop: 60 }}
                >
                  {this.state.user.nickname}
                </MuliText>
              )}
              <View style={{ padding: 20 }}>
                <MuliText style={styles.doneReport}>
                  Xin vui lòng báo cáo vi phạm của{' '}
                  {this.state.roleId == 2 ? 'người giữ trẻ' : 'phụ huynh'}. Phản
                  hồi của quý khách sẽ nhanh chóng được xử lí. Xin chân thành
                  xin lỗi vì sự bất tiện này.
                </MuliText>
              </View>
              <View style={styles.reportContainer}>
                <TextInput
                  multiline
                  maxLength={200}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({ description: text })}
                  style={styles.textReport}
                  value={description}
                />
              </View>
              {isRated ? (
                <View style={styles.ratedText}>
                  <MuliText style={styles.doneReport}>
                    Bạn đã gửi báo cáo vi phạm cho yêu cầu này. Chúng tôi sẽ
                    nhanh chóng xử lí yêu cầu của bạn.
                  </MuliText>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.submitRating();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <MuliText style={styles.textButton}>Gửi</MuliText>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Home');
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 25,
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <MuliText style={styles.textButton}>Để sau</MuliText>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
Feedback.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  textButton: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneReport: {
    color: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    marginLeft: 10,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  textReport: {
    textAlignVertical: 'top',
    marginHorizontal: 15,
    marginTop: 10,
    height: 200,
  },
  header: {
    backgroundColor: 'red',
    height: 170,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderColor: 'black',
    borderWidth: 1,
    height: 30,
    width: 100,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 6,
  },
  ratedText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
  },
  reportContainer: {
    marginTop: 20,
    borderWidth: 2,
    width: 350,
    borderRadius: 10,
  },
  star: {
    marginLeft: 10,
  },
});
