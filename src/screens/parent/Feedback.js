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

export default class Feedback extends Component {
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
            <TouchableOpacity
            
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
  name: {
    alignItems: 'center',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textReview: {
    marginLeft: 8,
    marginRight: 100,
    flex: 1,
  },
  line: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  reivewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameReview: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#315F61',
  },
  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  textOption: {
    marginHorizontal: 5,
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg2: {
    width: 60,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 100,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    paddingLeft: 15,
    fontWeight: '200',
    marginTop: 10,
  },
});