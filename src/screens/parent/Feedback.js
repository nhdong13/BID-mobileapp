import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import Api from 'api/api_helper';
import { withNavigation } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';

export class Feedback extends Component {
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
    Api.get('feedback/' + this.state.sittingRequestsID.toString()).then(res=> {
      if (res != null) {
        this.setState({ starCount: res[0].rating, isRated: true, });
      }
    });
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
      <ScrollView>
        <View style={{ marginHorizontal: 30, backgroundColor: 'white' }}>
          <View style={styles.detailInformationContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-calendar"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformationDate}>
                {moment(this.state.date).format('dddd Do MMMM')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {formater(this.state.price)} VND
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-timer"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {moment.utc(this.state.startTime, 'HH:mm').format('HH:mm')} -
                {moment.utc(this.state.endTime, 'HH:mm').format('HH:mm')}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-home"
                size={17}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.address}
              </MuliText>
            </View>
          </View>
          {/* render babysitter if exist */}
          {this.state.bsitter ? (
            <View style={styles.detailPictureContainer}>
              <Image
                source={this.state.detailPictureSitter}
                style={styles.profileImg}
              />
              <View style={styles.leftInformation}>
                <MuliText style={styles.pictureInformation}>
                  Người giữ trẻ
                </MuliText>
                <MuliText style={{ fontSize: 15 }}>
                  {this.state.bsitter.nickname}
                </MuliText>
              </View>
            </View>
          ) : (
            <View />
          )}
          {/* end */}
          <StarRating
            starStyle={{
              marginLeft: 10,
            }}
            fullStarColor={colors.lightGreen}
            starSize={30}
            disabled={false}
            maxStars={5}
            rating={this.state.starCount}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
          />
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Feedback);

Feedback.navigationOptions = {
  title: 'Yêu cầu chi tiết',
};

const styles = StyleSheet.create({
  rightInformationSitter: {
    marginLeft: 'auto',
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 10,
  },
  pictureInformationSitter: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  leftInformationSitter: {
    marginLeft: 5,
  },
  leftInformation: {
    marginTop: 5,
    marginLeft: 5,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    height: 80,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  lowerText: {
    flexDirection: 'row',
  },
  sectionContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: 5,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 20,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 5,
  },
  inviteButton: {
    flex: 1,
    width: 100,
    height: 30,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 45,
  },
  bsitterName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#315F61',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
  },
  sitterImage: {
    width: '100%',
    borderRadius: 15,
    resizeMode: 'contain',
    marginLeft: 45,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  listBabySitterButton: {
    marginVertical: 5,
    width: '100%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  detailContainer: {
    marginTop: 15,
  },
  name: {
    alignItems: 'center',
  },
  submitButton: {
    width: 250,
    height: 30,
    padding: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -15,
    marginHorizontal: 10,
    backgroundColor: '#315F61',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 14,
    color: '#315F61',
    marginBottom: 5,
    fontWeight: '800',
    marginLeft: 5,
  },
  optionsText: {
    fontSize: 15,
    color: 'gray',
    fontWeight: 'bold',
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  textAndDayContainer: {
    flexDirection: 'row',
  },
  informationText: {
    fontSize: 13,
    marginTop: 15,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  contentInformation: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#315F61',
  },
  contentInformationDate: {
    fontSize: 12,
    paddingLeft: 10,
    color: '#315F61',
    fontWeight: '700',
  },
  priceText: {
    fontSize: 15,
    marginLeft: 150,
    marginTop: 25,
    flexDirection: 'row',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 5,
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 15,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 45,
    marginTop: 25,
    flexDirection: 'row',
  },

  optionInformation: {
    fontSize: 13,
    paddingLeft: 10,
    fontWeight: '400',
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    paddingLeft: 10,
    fontWeight: '200',
    marginTop: 5,
  },
  textOption: {
    marginHorizontal: 5,
  },
});
