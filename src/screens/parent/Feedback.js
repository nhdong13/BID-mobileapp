/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TextInput,
  // TouchableOpacity,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
    };
  }

  componentDidMount() {
    Api.get('sittingRequests/' + this.state.sittingRequestsID.toString()).then(
      (resp) => {
        this.setState({
          date: resp.sittingDate,
          startTime: resp.startTime,
          endTime: resp.endTime,
          address: resp.sittingAddress,
          bsitter: resp.bsitter,
          price: resp.totalPrice,
        });
      },
    );
    Api.get('feedback/' + this.state.sittingRequestsID.toString()).then(
      (res) => {
        if (res != null) {
          this.setState({ starCount: res[0].rating, isRated: true });
        }
      },
    );
  }

  onStarRatingPress(rating) {
    const body = {
      rating: rating,
      requestId: this.state.sittingRequestsID,
    };
    if (!this.state.isRated) {
      Api.post('feedback/', body);
      this.setState({ starCount: rating, isRated: true });
    }
  }

  callDetail() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
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
              style={{
                textAlignVertical: 'top',
                marginHorizontal: 15,
                width: 300,
                height: 200,
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MuliText
                style={{
                  color: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Gửi
              </MuliText>
            </TouchableOpacity>
          </View>
        </View>
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
