/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
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
      selectedComment: [],
      clickedComment: -1,
      bsitterComments: [
        'Số lượng trẻ không đúng như yêu cầu',
        'Địa chỉ không đúng',
        'Khách bắt làm quá thời gian',
        'Công việc không đúng như mô tả',
      ],
      parentComments: ['Mất đồ', 'Người giữ trẻ không đến', 'Trẻ em bị đánh'],
      parentImage: '',
      sitterImage: '',
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
        parentImage: resp.user.image,
        sitterImage: resp.bsitter.image,
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

  submitRating = async () => {
    const {
      starCount,
      sittingRequestsID,
      roleId,
      selectedComment,
    } = this.state;
    let { description } = this.state;
    if (description && description != '') {
      description = '- ' + description + '\n';
    }
    await selectedComment.forEach((item, _index) => {
      if (this.state.roleId == 3) {
        description += '- ' + this.state.bsitterComments[item] + '\n';
      } else description += '- ' + this.state.parentComments[item] + '\n';
    });

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

  onClickComment = () => {
    const { selectedComment, clickedComment } = this.state;
    if (selectedComment.indexOf(clickedComment) != -1) {
      selectedComment.splice(selectedComment.indexOf(clickedComment), 1);
    } else selectedComment.push(clickedComment);
    this.setState({ selectedComment: selectedComment });
  };

  callDetail() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  render() {
    const {
      isRated,
      description,
      bsitterComments,
      selectedComment,
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={60}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <ScrollView>
            <View style={styles.header} />
            {this.state.roleId == 2 && this.state.bsitter && (
              <Image
                source={{ uri: this.state.sitterImage }}
                style={styles.avatar}
              />
            )}
            {this.state.roleId == 3 && this.state.user && (
              <Image
                source={{ uri: this.state.parentImage }}
                style={styles.avatar}
              />
            )}

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

              {/* babysitter report */}
              {!isRated && this.state.roleId == 3 && (
                <View style={styles.commentContainer}>
                  {bsitterComments.map((comment, index) => (
                    <View style={{ flexDirection: 'row' }} key={comment}>
                      <TouchableOpacity
                        onPress={async () => {
                          await this.setState({ clickedComment: index });
                          this.onClickComment();
                        }}
                      >
                        <View
                          style={{
                            marginTop: 15,
                            height: 30,
                            borderRadius: 6,
                            padding: 5,
                            backgroundColor:
                              selectedComment.indexOf(index) != -1
                                ? colors.darkGreenTitle
                                : 'gray',
                          }}
                        >
                          <MuliText style={{ color: 'white' }}>
                            {comment}
                          </MuliText>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {/*  */}

              {/* parent report */}
              {!isRated && this.state.roleId == 2 && (
                <View style={styles.commentContainer}>
                  {this.state.parentComments.map((comment, index) => (
                    <View style={{ flexDirection: 'row' }} key={comment}>
                      <TouchableOpacity
                        onPress={async () => {
                          await this.setState({ clickedComment: index });
                          this.onClickComment();
                        }}
                      >
                        <View
                          style={{
                            marginTop: 15,
                            height: 30,
                            borderRadius: 6,
                            padding: 5,
                            backgroundColor:
                              selectedComment.indexOf(index) != -1
                                ? colors.darkGreenTitle
                                : 'gray',
                          }}
                        >
                          <MuliText style={{ color: 'white' }}>
                            {comment}
                          </MuliText>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {/*  */}
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
  commentContainer: {
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
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
  // buttonComment: {
  //   marginTop: 15,
  //   height: 20,
  //   borderRadius: 6,
  // },
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
