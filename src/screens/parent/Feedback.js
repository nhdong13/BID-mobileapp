/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  // TouchableOpacity,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import Api from 'api/api_helper';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId,
      bsitter: null,
      isModalVisible: false,
      starCount: 5,
      isRated: false,
      description: '',
    };
  }

  async componentDidMount() {
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
      });
    });
    await Api.get('feedback/' + this.state.sittingRequestsID.toString()).then(
      (res) => {
        if (res != null) {
          this.setState({ starCount: res[0].rating, isRated: true });
        }
      },
    );
  }

  onStarRatingPress(rating) {
    if (!this.state.isRated) {
      this.setState({ starCount: rating });
    }
  }

  submitRating = () => {
    const { starCount, sittingRequestsID, description } = this.state;
    const body = {
      rating: starCount,
      requestId: sittingRequestsID,
      description: description,
    };
    console.log('PHUC: Feedback -> submitRating -> body', body);

    if (!this.state.isRated) {
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
    const { isRated } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, alignItems: 'center' }}
          keyboardVerticalOffset={60}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <ScrollView>
            <View style={styles.colorTop} />
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('assets/images/Phuc.png')}
                style={styles.pictureReport}
              />
              {this.state.bsitter && (
                <MuliText style={{ fontWeight: 'bold', fontSize: 25 }}>
                  {this.state.bsitter.nickname}
                </MuliText>
              )}
              <StarRating
                starStyle={{
                  marginLeft: 10,
                }}
                fullStarColor={colors.done}
                starSize={30}
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
              <View style={styles.reportContainer}>
                <TextInput
                  multiline
                  maxLength={200}
                  underlineColorAndroid="white"
                  onChangeText={(text) => this.setState({ description: text })}
                  style={{
                    textAlignVertical: 'top',
                    marginHorizontal: 15,
                    width: 300,
                    height: 200,
                  }}
                />
              </View>
              {isRated ? (
                <View style={styles.ratedText}>
                  <MuliText
                    style={{
                      color: colors.gray,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Bạn đã đánh giá cho yêu cầu này
                  </MuliText>
                </View>
              ) : (
                <View>
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
                      <MuliText
                        style={{
                          color: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Gửi
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Home');
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <MuliText
                        style={{
                          color: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Để sau
                      </MuliText>
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
  title: 'Phản hồi',
};

const styles = StyleSheet.create({
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
    marginTop: 15,
  },
  reportContainer: {
    marginTop: 10,
    borderWidth: 2,
    width: 350,
    height: 200,
  },
  star: {
    marginLeft: 10,
  },
  pictureReport: {
    width: 120,
    height: 120,
    marginTop: SCREEN_HEIGHT / 5.5,
    borderRadius: 120 / 2,
    overflow: 'hidden',
  },
  colorTop: {
    width: SCREEN_WIDTH,
    height: 0,
    borderTopColor: colors.done,
    borderTopWidth: SCREEN_HEIGHT / 4,
    borderRightWidth: SCREEN_WIDTH,
    borderRightColor: colors.done,
    position: 'absolute',
    alignItems: 'center',
  },
});
