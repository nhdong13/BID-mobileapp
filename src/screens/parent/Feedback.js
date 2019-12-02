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
        console.log('PHUC: Feedback -> componentDidMount -> res', res);
        if (res != null) {
          this.setState({
            starCount: res[0].rating,
            isRated: true,
            description: res[0].description,
          });
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
              {this.state.bsitter && (
                <MuliText
                  style={{ fontWeight: 'bold', fontSize: 25, marginTop: 60 }}
                >
                  {this.state.bsitter.nickname}
                </MuliText>
              )}
              <StarRating
                starStyle={styles.starContainer}
                fullStarColor={colors.star}
                starSize={55}
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
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
                    Bạn đã đánh giá cho yêu cầu này
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
    backgroundColor: colors.darkGreenTitle,
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
