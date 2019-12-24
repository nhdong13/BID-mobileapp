/* eslint-disable no-undef */
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId,
      date: null,
      startTime: null,
      endTime: null,
      address: null,
      price: 0,
      bsitter: null,
      isModalVisible: false,
      starCount: 0,
      isRated: false,
      imageSitter: '',
    };
    this.callDetail = this.callDetail.bind(this);
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
          imageSitter: resp.bsitter.image,
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
          <MuliText style={{ fontWeight: 'bold', fontSize: 25 }}>
            {this.state.bsitter.nickname}
          </MuliText>
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
              style={{ paddingHorizontal: 15 }}
              value=""
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchContainer}>
              <MuliText style={styles.textButton}>Gửi</MuliText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
ReportScreen.navigationOptions = {
  title: 'Report Screen',
};

const styles = StyleSheet.create({
  touchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
  reportContainer: {
    marginTop: 10,
    borderWidth: 2,
    width: 300,
    height: 300,
    marginHorizontal: 15,
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
