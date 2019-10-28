/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { MuliText } from 'components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';
import { ScrollView } from 'react-native-gesture-handler';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import { updateRequest } from 'api/sittingRequest.api';
import { CheckBox } from 'native-base';

class CreateRequestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: 0,
      userId: null,
      loggedUser: null,
      sittingDate: null || this.props.navigation.getParam('selectedDate'),
      startTime: null,
      endTime: null,
      sittingAddress: null,
      price: 0,
      childrenNumber: 0,
      minAgeOfChildren: 99,
      child: null,
      totalPrice: 0,
      spPrice: null,
    };
    console.log(this.props.navigation.getParam('selectedDate'));
  }

  async componentDidMount() {
    await this.getDataAccordingToRole();

    Api.get('users/' + this.state.userId.toString()).then((res) => {
      this.setState({
        loggedUser: res,
        sittingAddress: res.address,
        child: res.parent.children,
      });
      // console.log(
      // 'PHUC: CreateRequestScreen -> componentDidMount -> loggedUser',
      // this.state.loggedUser,
      // );
    });
  }

  onCreateRequest = () => {
    if (this.state.childrenNumber == 0) {
      return;
    }
    const request = {
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.price,
    };
    // console.log(request);
    Api.post('sittingRequests', request)
      .then((res) => {
        if (res) {
          this.props.navigation.navigate('Recommend', { requestId: res.id });
        }
      })
      .catch((error) => console.log(error));
  };

  toRecommendScreen = () => {
    if (this.state.childrenNumber == 0) {
      return;
    }
    const request = {
      requestId: this.state.requestId != 0 ? this.state.requestId : 0,
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.price,
    };

    this.props.navigation.navigate('Recommend', {
      requestId: this.state.requestId,
      request: request,
      onGoBack: (requestId) => this.setState({ requestId: requestId }),
    });
  };

  updateRequest = async () => {
    const request = {
      id: this.state.requestId,
      createdUser: this.state.userId,
      sittingDate: this.state.sittingDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      sittingAddress: this.state.sittingAddress,
      childrenNumber: this.state.childrenNumber,
      minAgeOfChildren: this.state.minAgeOfChildren,
      status: 'PENDING',
      totalPrice: this.state.price,
    };

    console.log(request);
    await updateRequest(request).then(() => {
      this.props.navigation.navigate('Recommend', {
        requestId: this.state.requestId,
        request: request,
        onGoBack: (requestId) => this.setState({ requestId: requestId }),
      });
    });
  };

  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
      // console.log(
      // 'PHUC: CreateRequestScreen -> getDataAccordingToRole -> roleId',
      // roleId + this.state.roleId,
      // );
    });
  };

  toggleHidden = (key) => {
    // eslint-disable-next-line no-unused-expressions
    key.checked == null ? (key.checked = true) : (key.checked = !key.checked);
    this.forceUpdate();
    this.calculate();
  };

  calculate = () => {
    let childCounter = 0;
    let minAge = 99;
    this.state.child.forEach((element) => {
      if (element.checked) {
        childCounter += 1;
        if (minAge > element.age) minAge = element.age;
      }
    });
    this.setState({ childrenNumber: childCounter, minAgeOfChildren: minAge });
  };

  updatePrice = async () => {
    if (this.state.startTime == null || this.state.endTime == null) return;
    await Api.get('configuration/' + this.state.sittingDate.toString()).then(
      (res) => {
        this.setState({
          spPrice: res,
        });
      },
    );

    // eslint-disable-next-line radix
    const startP = parseInt(this.state.startTime[0] + this.state.startTime[1]);
    // eslint-disable-next-line radix
    const endP = parseInt(this.state.endTime[0] + this.state.endTime[1]);
    //
    // console.log(abc + 'aaaa');
    let i;

    let tempTotal = 0.0;
    // eslint-disable-next-line no-plusplus
    for (i = startP + 1; i < endP; i++) {
      let temp = this.state.spPrice[i.toString()];
      if (temp == null) tempTotal += this.state.spPrice['base'];
      else tempTotal += temp;
    }
    let temp = 0.0;
    temp =
      (60 - parseInt(this.state.startTime[3] + this.state.startTime[4])) / 60.0;
    let price = this.state.spPrice[startP.toString()];
    if (price == null) tempTotal += this.state.spPrice['base'] * temp;
    else tempTotal += temp * price;
    temp = parseInt(this.state.endTime[3] + this.state.endTime[4]) / 60.0;
    price = this.state.spPrice[endP.toString()];
    if (price == null) tempTotal += this.state.spPrice['base'] * temp;
    else tempTotal += temp * price;
    this.setState({ price: tempTotal });
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.containerInformationRequest}>
          <MuliText style={styles.headerTitle}>Trông trẻ</MuliText>
          <View>
            <View style={styles.inputDay}>
              <Ionicons
                name="ios-calendar"
                size={20}
                color={colors.lightGreen}
                style={{
                  marginTop: 10,
                }}
              />
              <DatePicker
                style={styles.pickedDate}
                date={this.state.sittingDate}
                mode="date"
                placeholder="Ngày"
                format="YYYY-MM-DD"
                minDate={moment().format('YYYY-MM-DD')}
                maxDate="2019-12-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                  },
                  placeholderText: {
                    fontSize: 15,
                    color: colors.lightGreen,
                    marginRight: 75,
                  },
                  dateText: {
                    fontSize: 15,
                    color: colors.lightGreen,
                  },
                }}
                onDateChange={async (date) => {
                  await this.setState({ sittingDate: date });
                  this.updatePrice();
                }}
                showIcon={false}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <View style={styles.input}>
                <Ionicons
                  name="ios-timer"
                  size={20}
                  color={colors.gray}
                  style={{
                    marginTop: 10,
                  }}
                />

                <DatePicker
                  style={styles.pickedTime}
                  date={this.state.startTime}
                  // minDate={moment().format()}
                  // maxDate={this.state.endTime}
                  mode="time"
                  placeholder="Giờ bắt đầu"
                  format="HH:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 15,
                      color: colors.gray,
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 15,
                      color: 'black',
                    },
                  }}
                  is24Hour
                  onDateChange={async (time) => {
                    await this.setState({ startTime: time });
                    console.log(this.state.startTime);
                    this.updatePrice();
                  }}
                  showIcon={false}
                />
              </View>
            </View>
            <View>
              <View style={styles.input}>
                <Ionicons
                  name="ios-time"
                  size={20}
                  color={colors.gray}
                  style={{
                    marginTop: 10,
                  }}
                />
                <DatePicker
                  style={styles.pickedTime}
                  // minDate={this.state.startTime}
                  date={this.state.endTime}
                  mode="time"
                  placeholder="Giờ kết thúc"
                  format="HH:mm"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 15,
                      color: colors.gray,
                      marginRight: 30,
                    },
                    dateText: {
                      fontSize: 15,
                      color: 'black',
                    },
                  }}
                  is24Hour
                  onDateChange={async (time) => {
                    await this.setState({ endTime: time });
                    console.log(this.state.endTime);
                    this.updatePrice();
                  }}
                  showIcon={false}
                />
              </View>
            </View>
          </View>
          <View style={styles.inputAddress}>
            <Ionicons
              name="ios-home"
              size={20}
              color={colors.gray}
              style={{
                marginBottom: 5,
              }}
            />
            <MuliText style={styles.contentInformation}>
              Địa chỉ: {this.state.sittingAddress}
            </MuliText>
          </View>
          <MuliText style={styles.headerTitle}>Trẻ em</MuliText>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.input}>
              <Ionicons
                name="ios-happy"
                size={20}
                color={colors.gray}
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>
                Số trẻ: {this.state.childrenNumber}{' '}
              </MuliText>
            </View>
            <View style={styles.input}>
              <Ionicons
                name="ios-heart-empty"
                size={20}
                color={colors.gray}
                style={{
                  marginBottom: 5,
                }}
              />
              <MuliText style={styles.contentInformation}>
                Nhỏ tuổi nhất:{' '}
                {this.state.minAgeOfChildren == 99
                  ? 'N/A'
                  : this.state.minAgeOfChildren}
              </MuliText>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {this.state.child != null ? (
              <View style={styles.detailContainerChild}>
                <MuliText style={styles.headerTitleChild}>
                  Trẻ của bạn:
                  {/* {this.state.child.length} */}
                </MuliText>
                <View style={styles.detailPictureContainer}>
                  {this.state.child.map((item) => (
                    // eslint-disable-next-line react/no-array-index-key

                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        this.toggleHidden(item);
                      }}
                    >
                      <View
                        style={{
                          alignContent: 'space-between',
                          flexDirection: 'row',
                          marginLeft: 40,
                        }}
                      >
                        <View style={{ alignItems: 'center' }}>
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              opacity:
                                item.checked == null || item.checked == false
                                  ? 0.1
                                  : null,
                              width: 60,
                              height: 60,
                              borderRadius: 120 / 2,
                              overflow: 'hidden',
                            }}
                          />
                          <View>
                            <View
                              style={{
                                alignItems: 'center',
                              }}
                            >
                              <MuliText
                                style={{
                                  color:
                                    item.checked == null ||
                                    item.checked == false
                                      ? colors.gray
                                      : (color = 'black'),
                                }}
                              >
                                {item.name}
                              </MuliText>
                              <MuliText
                                style={{
                                  color:
                                    item.checked == null ||
                                    item.checked == false
                                      ? colors.gray
                                      : (color = 'black'),
                                }}
                              >
                                {item.age} tuổi
                              </MuliText>
                            </View>
                            <CheckBox
                              style={{
                                marginTop: 5,
                                width: 18,
                                height: 18,
                                borderRadius: 20 / 2,
                                borderColor:
                                  item.checked == null || item.checked == false
                                    ? colors.gray
                                    : (color = 'black'),
                                backgroundColor:
                                  item.checked == null || item.checked == false
                                    ? (color = 'white')
                                    : (color = 'black'),
                              }}
                              checked={
                                item.checked == null || item.checked == false
                                  ? false
                                  : true
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View>
            <MuliText style={styles.headerTitle}>Thanh toán</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>
                Tổng tiền thanh toán:
              </MuliText>
              <MuliText style={styles.price}>{this.state.price} VND</MuliText>
            </View>
          </View>
          {this.state.requestId != 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.updateRequest}
              >
                <MuliText style={{ color: 'white', fontSize: 16 }}>
                  Kế tiếp
                </MuliText>
              </TouchableOpacity>
            </View>
          )}
          {this.state.requestId == 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.toRecommendScreen}
              >
                <MuliText style={{ color: 'white', fontSize: 16 }}>
                  Kế tiếp
                </MuliText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  title: 'Tạo yêu cầu giữ trẻ',
};

const styles = StyleSheet.create({
  price: {
    fontSize: 15,
    color: '#7edeb9',
    fontWeight: '800',
  },
  priceContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDay: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
    borderColor: '#7edeb9',
  },
  inputAddress: {
    borderColor: colors.gray,
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 2,
    marginHorizontal: 15,
    marginTop: 15,
  },
  contentInformation: {
    color: colors.gray,
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
  containerInformationRequest: {
    marginHorizontal: 15,
    marginTop: 30,
  },
  headerTitleChild: {
    fontSize: 20,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 20,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  submitButton: {
    width: 200,
    height: 50,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailContainerChild: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
});
