/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import moment from 'moment';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import DatePicker from 'react-native-datepicker';
import { Ionicons } from '@expo/vector-icons/';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import {
  updateRequest,
  getOverlapSittingRequest,
} from 'api/sittingRequest.api';
import { CheckBox } from 'native-base';
import { formater } from 'utils/MoneyFormater';
import Toast, { DURATION } from 'react-native-easy-toast';
import AlertPro from 'react-native-alert-pro';
import Modal from 'react-native-modal';
import { getCircle } from 'api/circle.api';
import { TextInput } from 'react-native-gesture-handler';
import { getAllBabysitter } from 'api/babysitter.api';
import ItemSearchSitter from 'screens/parent/ItemSearchSitter';

// const { width, height } = Dimensions.get('window');

class SearchSitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: 0,
      userId: null,
      loggedUser: null,
      sittingDate:
        this.props.navigation.getParam('selectedDate') ||
        new moment().format('YYYY-MM-DD'),
      startTime: null,
      endTime: null,
      sittingAddress: null,
      price: 0,
      childrenNumber: 0,
      minAgeOfChildren: 99,
      child: null,
      totalPrice: 0,
      spPrice: null,
      overlapRequests: [],
      noticeTitle: '',
      noticeMessage: '',
      cancelAlert: '',
      confirmAlert: '',
      showConfirm: false,
      isModalVisible: false,
      hiredSitter: null,
      searchValue: '',
      listBabysitter: null,
      data: null,
      request: null,
    };
  }

  async componentDidMount() {
    await this.getUserData();

    Api.get('users/' + this.state.userId.toString()).then((res) => {
      this.setState({
        loggedUser: res,
        sittingAddress: res.address,
        child: res.parent.children,
      });
    });
  }

  beforeSearch = async () => {
    if (this.state.startTime == null || this.state.endTime == null) {
      this.refs.toast.show(
        'Vui lòng chọn thời gian trông trẻ',
        DURATION.LENGTH_LONG,
      );
      return;
    }

    const start = moment(this.state.startTime, 'HH:mm');
    const end = moment(this.state.endTime, 'HH:mm').subtract(1, 'hour');
    if (end.isBefore(start)) {
      this.refs.toast.show(
        'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng',
        DURATION.LENGTH_LONG,
      );
      return;
    }

    if (this.state.childrenNumber == 0) {
      this.refs.toast.show(
        'Vui lòng chọn ít nhất một trẻ',
        DURATION.LENGTH_LONG,
      );
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

    await getAllBabysitter().then(async (res) => {
      if (res) {
        // console.log('PHUC: SearchSitter -> beforeSearch -> res', res.data);
        await this.setState({ listBabysitter: res.data, request });
      }
    });

    this.toggleModalCreateRequest();
  };

  searchFilter = (text) => {
    const newData = this.state.listBabysitter.filter((sitter) => {
      const itemData = `${sitter.user.nickname.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData });
  };

  beforeRecommend = () => {
    if (this.state.startTime == null || this.state.endTime == null) {
      this.refs.toast.show(
        'Vui lòng chọn thời gian trông trẻ',
        // DURATION.LENGTH_LONG,
      );
      return;
    }

    const start = moment(this.state.startTime, 'HH:mm');
    const end = moment(this.state.endTime, 'HH:mm').subtract(1, 'hour');
    if (end.isBefore(start)) {
      this.refs.toast.show(
        'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng',
        // DURATION.LENGTH_LONG,
      );
      return;
    }

    if (this.state.childrenNumber == 0) {
      this.refs.toast.show(
        'Vui lòng chọn ít nhất một trẻ',
        DURATION.LENGTH_LONG,
      );
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

    getOverlapSittingRequest(request)
      .then((result) => {
        // is overlap with other request
        if (result.data.length > 0) {
          this.setState({
            noticeTitle: 'Yêu cầu trùng lặp',
            noticeMessage: `Bạn có ${result.data.length} yêu cầu đã tạo với khoảng thời trên. Tạo yêu cầu trông trẻ sẽ mất phí. Bạn có chắc muốn tạo thêm?`,
            showConfirm: true,
            cancelAlert: 'Hủy',
            confirmAlert: 'Tiếp tục',
            overlapRequests: result.data,
          });
          //
          this.AlertPro.open();
        } else {
          this.toRecommendScreen();
        }
      })
      .catch((error) => {
        if (error.response.status == 409) {
          this.refs.toast.show(
            'Không thể đặt yêu cầu cho ngày giờ ở quá khứ, vui lòng chọn lại.',
            DURATION.LENGTH_LONG,
          );
        } else {
          this.refs.toast.show(
            'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
            DURATION.LENGTH_LONG,
          );
        }
      });
  };

  getCircle = async () => {
    const { userId } = this.state;

    getCircle(userId)
      .then((result) => {
        const { hiredSitter } = result.data;
        this.setState({
          //   circle: result.data.circle,
          hiredSitter,
          //   friendSitter: result.data.friendSitter,
        });
      })
      .catch((error) => {
        console.log('Duong: CircleScreens -> getCircle -> error', error);
      });
  };

  close = () => {
    this.setState({ isModalVisible: false });
  };

  changeInviteStatus = (receiverId) => {
    this.setState((prevState) => ({
      data: prevState.data.map((el) =>
        el.userId == receiverId ? Object.assign(el, { isInvited: true }) : el,
      ),
    }));
  };

  setRequestId = (requestId) => {
    this.setState({ requestId: requestId });
    this.props.navigation.state.params.onGoBack(requestId);
  };

  toRecommendScreen = () => {
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

    this.AlertPro.close();
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

    // console.log(request);
    await updateRequest(request).then(() => {
      this.props.navigation.navigate('Recommend', {
        requestId: this.state.requestId,
        request: request,
        onGoBack: (requestId) => this.setState({ requestId: requestId }),
      });
    });
  };

  getUserData = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
    });
  };

  toggleModalCreateRequest = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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

    const startP = parseInt(
      this.state.startTime[0] + this.state.startTime[1],
      10,
    );
    const endP = parseInt(this.state.endTime[0] + this.state.endTime[1], 10);
    let i;

    let tempTotal = 0.0;
    // eslint-disable-next-line no-plusplus
    for (i = startP + 1; i < endP; i++) {
      const temp = this.state.spPrice[i.toString()];
      if (temp == null) tempTotal += this.state.spPrice.base;
      else tempTotal += temp;
    }
    let temp = 0.0;
    temp =
      (60 - parseInt(this.state.startTime[3] + this.state.startTime[4], 10)) /
      60.0;
    let price = this.state.spPrice[startP.toString()];
    if (price == null) tempTotal += this.state.spPrice.base * temp;
    else tempTotal += temp * price;
    temp = parseInt(this.state.endTime[3] + this.state.endTime[4], 10) / 60.0;
    price = this.state.spPrice[endP.toString()];
    if (price == null) tempTotal += this.state.spPrice.base * temp;
    else tempTotal += temp * price;
    this.setState({ price: Math.floor(tempTotal) });
  };

  render() {
    const {
      noticeTitle,
      noticeMessage,
      cancelAlert,
      confirmAlert,
      isModalVisible,
      sittingDate,
      startTime,
      endTime,
      request,
    } = this.state;

    return (
      <ScrollView>
        <Toast ref="toast" position="top" />
        <AlertPro
          ref={(ref) => {
            this.AlertPro = ref;
          }}
          onConfirm={() => this.toRecommendScreen()}
          onCancel={() => this.AlertPro.close()}
          title={noticeTitle}
          message={noticeMessage}
          textCancel={cancelAlert}
          textConfirm={confirmAlert}
          customStyles={{
            mask: {
              backgroundColor: 'transparent',
            },
            container: {
              shadowColor: '#000000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            buttonCancel: {
              backgroundColor: colors.canceled,
            },
            buttonConfirm: {
              backgroundColor: colors.buttonConfirm,
            },
          }}
        />

        <Modal
          isVisible={isModalVisible}
          coverScreen={true}
          hasBackdrop={true}
          propagateSwipe={true}
          onBackButtonPress={() => this.toggleModalCreateRequest()}
          onBackdropPress={() => this.toggleModalCreateRequest()}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
        >
          <View
            style={{
              flex: 0.5,
              backgroundColor: 'white',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
            }}
          >
            <ScrollView>
              <View style={{ marginHorizontal: 10 }}>
                <View style={styles.detailContainerParent}>
                  <TextInput
                    style={styles.searchParent}
                    onChangeText={async (text) => {
                      this.searchFilter(text);
                    }}
                    placeholder="Nhập tên người giữ trẻ cần tìm"
                  />
                </View>
                {this.state.data && this.state.data.length != 0 && (
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                      <ItemSearchSitter
                        changeInviteStatus={this.changeInviteStatus}
                        setRequestId={this.setRequestId}
                        requestId={this.state.requestId}
                        request={request}
                        item={item}
                      />
                    )}
                    keyExtractor={(item) => item.user.id.toString()}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
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
                date={sittingDate}
                mode="date"
                placeholder="Ngày"
                format="YYYY-MM-DD"
                minDate={moment().format('YYYY-MM-DD')}
                maxDate="2019-12-30"
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
                date={startTime}
                mode="time"
                placeholder="Giờ bắt đầu"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
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
                date={endTime}
                mode="time"
                placeholder="Giờ kết thúc"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
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
                // minuteInterval={15}
              />
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
          <View style={{ flexDirection: 'row' }}>
            {this.state.child != null ? (
              <View style={styles.detailContainerChild}>
                <MuliText style={styles.headerTitleChild}>
                  Trẻ của bạn:
                </MuliText>
                <View style={styles.detailPictureContainer}>
                  {this.state.child.map((item) => (
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
                        <View>
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
                            <View style={{ alignItems: 'center' }}>
                              <MuliText
                                style={{
                                  color:
                                    item.checked == null ||
                                    item.checked == false
                                      ? colors.gray
                                      : 'black',
                                }}
                              >
                                {item.name}
                              </MuliText>
                              <View style={{ alignContent: 'center' }}>
                                <MuliText
                                  style={{
                                    color:
                                      item.checked == null ||
                                      item.checked == false
                                        ? colors.gray
                                        : 'black',
                                  }}
                                >
                                  {item.age} tuổi
                                </MuliText>
                                <CheckBox
                                  onPress={() => {
                                    this.toggleHidden(item);
                                  }}
                                  style={{
                                    marginTop: 5,
                                    width: 18,
                                    height: 18,
                                    borderRadius: 20 / 2,
                                    borderColor:
                                      item.checked == null ||
                                      item.checked == false
                                        ? colors.gray
                                        : 'black',
                                    backgroundColor:
                                      item.checked == null ||
                                      item.checked == false
                                        ? 'white'
                                        : 'black',
                                  }}
                                  checked={
                                    !(
                                      item.checked == null ||
                                      item.checked == false
                                    )
                                  }
                                />
                              </View>
                            </View>
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
          <View>
            <MuliText style={styles.headerTitle}>Thanh toán</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>
                Tổng tiền thanh toán:
              </MuliText>
              <MuliText style={styles.price}>
                {formater(this.state.price)} Đồng
              </MuliText>
            </View>
          </View>
          {this.state.requestId == 0 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  // this.toggleModalCreateRequest();
                  this.beforeSearch();
                  //   this.beforeRecommend();
                }}
              >
                <MuliText style={{ color: 'white', fontSize: 11 }}>
                  Kế tiếp
                </MuliText>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: 15,
                marginTop: 30,
                alignItems: 'center',
              }}
            >
              <MuliText style={{ color: colors.gray, fontSize: 12 }}>
                Bạn không thể thay đổi yêu cầu giữ trẻ khi đã mời bảo mẫu
              </MuliText>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default SearchSitter;

SearchSitter.navigationOptions = {
  title: 'Tạo yêu cầu trong vòng tròn tin tưởng',
};

const styles = StyleSheet.create({
  price: {
    fontSize: 15,
    color: colors.lightGreen,
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
    borderColor: colors.lightGreen,
  },
  inputAddress: {
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
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
  containerInformationRequest: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  headerTitleChild: {
    fontSize: 20,
    color: colors.darkGreenTitle,
    marginBottom: 15,
    fontWeight: '800',
  },
  headerTitle: {
    marginHorizontal: 15,
    marginTop: 30,
    fontSize: 20,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  submitButton: {
    width: 170,
    height: 40,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.darkGreenTitle,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 15,
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
  modalBottom: {
    flex: 3,
    height: 100,
    backgroundColor: 'white',
    marginVertical: 10,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 10,
  },
  headModalBottom: {
    flex: 1,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGreen,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  searchParent: {
    width: 290,
    marginLeft: 10,
    marginTop: 5,
  },
  detailContainerParent: {
    borderRadius: 7,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 20,
  },
});
