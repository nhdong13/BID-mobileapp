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
import { Ionicons, AntDesign } from '@expo/vector-icons/';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import {
  updateRequest,
  getOverlapSittingRequest,
} from 'api/sittingRequest.api';
import { CheckBox } from 'native-base';
import { formater } from 'utils/MoneyFormater';
import Toast from 'react-native-root-toast';

import AlertPro from 'react-native-alert-pro';
import Modal from 'react-native-modal';
import { getCircle } from 'api/circle.api';
import { TextInput } from 'react-native-gesture-handler';
import { getAllBabysitter, searchBabysitter } from 'api/babysitter.api';
import ItemSearchSitter from 'screens/parent/ItemSearchSitter';
import { getPricings } from 'api/pricing.api';
import { getHolidays } from 'api/holiday.api';
import { getConfigs } from 'api/configuration.api';
import { getUser } from 'api/user.api';
import { getCerts } from 'api/cert.api';
import { getSkills } from 'api/skill.api';
import MultiSelect from 'react-native-multiple-select';
import { create } from 'api/circle.api';
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
      totalPrice: 0,
      childrenNumber: 0,
      minAgeOfChildren: 99,
      children: null,
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
      pricings: [],
      holidays: [],
      officeHourStart: null,
      officeHourEnd: null,
      selectedChildren: [],
      request: null,
      skills: [],
      certs: [],

      selectedSkills: [],
      selectedCerts: [],
      requiredSkills: [{ skillId: 1 }],
      requiredCerts: [{ certId: 1 }],
      isParent: false,
      circle: [],
    };
  }

  async componentDidMount() {
    await this.getUserData();

    getUser().then((parent) => {
      // console.log('OWNED CIRCLES ------------------- ', parent.ownedCircles);
      // console.log('JOINED CIRCLES ------------------- ', parent.joinedCircles);
      this.setState({
        loggedUser: parent,
        userId: parent.id,
        sittingAddress: parent.address,
        children: parent.parent.children,
        circle: parent.ownedCircles,
      });
    });

    await getCerts().then((certs) => {
      certs.status == 200 ? this.setState({ certs: certs.data }) : [];
    });

    await getSkills().then((skills) => {
      skills.status == 200 ? this.setState({ skills: skills.data }) : [];
    });
  }

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
      .catch((error) => {});
  };

  close = () => {
    this.setState({ isModalVisible: false });
  };

  searchSitters = async () => {
    const {
      selectedCerts,
      selectedSkills,
      sittingAddress,
      requiredSkills,
      requiredCerts,
    } = this.state;
    const requiredSkillsPicked = selectedSkills.map((skill) => ({
      skillId: skill,
    }));
    const requiredCertsPicked = selectedCerts.map((cert) => ({
      certId: cert,
    }));

    const searchData = {
      name: '',
      skills:
        requiredSkillsPicked.length > 0 ? requiredSkillsPicked : requiredSkills,
      certs:
        requiredCertsPicked.length > 0 ? requiredCertsPicked : requiredCerts,
      baseAddress: sittingAddress,
    };

    await searchBabysitter(searchData).then(async (res) => {
      if (res.status == 200) {
        const data = res.data.sitters;

        const ids = [this.state.userId];

        const results = res.data.sitters.filter((id) => {
          return id.user.joinedCircles.every((it) => {
            return this.state.userId !== it.ownerId;
          });
        });

        await this.setState({ listBabysitter: results });
      }
    });

    // console.log('CIRCLE --------------- ', this.state.listBabysitter);
    //

    this.toggleModalCreateRequest();
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
      totalPrice: this.state.totalPrice,
    };

    this.props.navigation.navigate('Recommend', {
      requestId: this.state.requestId,
      request: request,
      onGoBack: (requestId) => this.setState({ requestId: requestId }),
    });

    this.AlertPro.close();
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

  toggleHidden = async (key) => {
    // eslint-disable-next-line no-unused-expressions
    key.checked == null ? (key.checked = true) : (key.checked = !key.checked);
    this.forceUpdate();
    await this.calculate();
    this.updatePrice();
  };

  onSelectedSkillsChange = (selectedSkills) => {
    this.setState({ selectedSkills });
  };

  onSelectedCertsChange = (selectedCerts) => {
    this.setState({ selectedCerts });
  };

  calAge = (dateOfBirth) => {
    const born = this.getYear(dateOfBirth);
    const now = moment().year();
    return now - born;
  };

  getYear = (dateOfBirth) => {
    const arr = dateOfBirth.split('-');
    return arr[0];
  };

  changeInviteStatus = (receiverId) => {
    this.setState({ ['invitedUser_' + receiverId]: true });
  };

  addSitterToCircle = (userId) => {
    this.changeInviteStatus(userId);
    this.addToCircle(userId);
  };

  showToast = (message) => {
    message
      ? Toast.show(message, {
          duration: Toast.durations.LONG,
          position: 20,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          onShow: () => {
            // calls on toast\`s appear animation start
          },
          onShown: () => {
            // calls on toast\`s appear animation end.
          },
          onHide: () => {
            // calls on toast\`s hide animation start.
          },
          onHidden: () => {
            // calls on toast\`s hide animation end.
          },
        })
      : console.log('no message');
  };

  addToCircle = async (sitterId) => {
    this.showToast('Member successfully added to circle');
    if (this.state.userId && sitterId) {
      await create(this.state.userId, sitterId, this.state.isParent);
    } else {
      this.showToast('Add member to circle faild, Please try again');
    }
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
      selectedSkills,
      selectedCerts,
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
              flex: 0.8,
              backgroundColor: 'white',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
            }}
          >
            <ScrollView>
              <View style={{ marginHorizontal: 10 }}>
                {this.state.listBabysitter &&
                this.state.listBabysitter.length > 0 ? (
                  <FlatList
                    data={this.state.listBabysitter}
                    renderItem={({ item }) => (
                      <View>
                        <View key={item.user.id} style={{ marginTop: 20 }}>
                          <View style={styles.ItemSearchSitterItem}>
                            <TouchableOpacity
                              style={{ flexDirection: 'row', flexGrow: 2 }}
                            >
                              <Image
                                source={{ uri: item.user.image }}
                                style={styles.sitterImage}
                              />
                              <View>
                                <View style={styles.upperText}>
                                  <MuliText style={styles.ItemSearchSitterName}>
                                    {item.user.nickname} -{' '}
                                    {this.calAge(item.user.dateOfBirth)} tuổi
                                  </MuliText>
                                  {item.user.gender == 'MALE' && (
                                    <Ionicons
                                      name="ios-male"
                                      size={18}
                                      style={{
                                        marginBottom: -3,
                                        marginLeft: 5,
                                      }}
                                      color={colors.blueAqua}
                                    />
                                  )}
                                  {item.user.gender == 'FEMALE' && (
                                    <Ionicons
                                      name="ios-female"
                                      size={18}
                                      style={{
                                        marginBottom: -3,
                                        marginLeft: 5,
                                      }}
                                      color={colors.pinkLight}
                                    />
                                  )}
                                </View>
                                <View style={styles.lowerText}>
                                  <Ionicons
                                    name="ios-star"
                                    size={19}
                                    style={{ marginLeft: 5 }}
                                    color={colors.lightGreen}
                                  />

                                  <MuliText
                                    style={
                                      item.totalFeedback > 10
                                        ? styles.green
                                        : styles.red
                                    }
                                  >
                                    {item.averageRating.toFixed(0)} (
                                    {item.totalFeedback})
                                  </MuliText>
                                </View>
                              </View>
                            </TouchableOpacity>
                            <View />
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {!this.state['invitedUser_' + item.user.id] && (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.addSitterToCircle(item.user.id)
                                  }
                                >
                                  <View
                                    style={{
                                      margin: 5,
                                      padding: 5,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <AntDesign
                                      name="pluscircle"
                                      size={20}
                                      color={colors.gray}
                                      style={{
                                        marginTop: 5,
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              )}
                              {this.state['invitedUser_' + item.user.id] && (
                                <TouchableOpacity disabled={true}>
                                  <View
                                    style={{
                                      margin: 5,
                                      padding: 5,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <AntDesign
                                      name="check"
                                      size={20}
                                      color={colors.lightGreen}
                                      style={{
                                        marginTop: 5,
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                ) : (
                  <View>
                    <View
                      style={{ padding: 10, margin: 20, alignItems: 'center' }}
                    >
                      <MuliText style={styles.headerTitle}>
                        Không có người giữ trẻ nào phù hợp với yêu cầu, Vui lòng
                        thử lại sau
                      </MuliText>

                      <AntDesign
                        name="frown"
                        size={40}
                        color={colors.lightGreen}
                        style={{
                          marginTop: 45,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
        <View style={styles.containerInformationRequest}>
          <MuliText style={styles.headerTitle}>Kỹ năng & bằng cấp</MuliText>
          <View>
            <View>
              <MuliText style={styles.mediumTitle}>Kỹ Năng</MuliText>
              <MultiSelect
                hideTags
                items={this.state.skills}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.onSelectedSkillsChange}
                selectedItems={selectedSkills}
                selectText="Vui lòng chọn"
                searchInputPlaceholderText="Tìm kiếm ..."
                onChangeInput={(text) => console.log(text)}
                altFontFamily="muli"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="vname"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor={colors.darkGreenTitle}
                submitButtonText="Chọn"
              />
            </View>
            {this.state.selectedSkills &&
            this.state.selectedSkills.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
              >
                {this.state.selectedSkills.map((item) => (
                  <TouchableOpacity key={item}>
                    <View style={styles.smallbutton}>
                      <MuliText style={{ color: '#ffffff' }}>
                        {
                          this.state.skills.find((skill) => skill.id == item)
                            .vname
                        }
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View />
            )}
          </View>
          <View>
            <View>
              <MuliText style={styles.mediumTitle}>Bằng cấp</MuliText>
              <MultiSelect
                hideTags
                items={this.state.certs}
                uniqueKey="id"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.onSelectedCertsChange}
                selectedItems={selectedCerts}
                selectText="Vui lòng chọn"
                searchInputPlaceholderText="Tìm kiếm ..."
                onChangeInput={(text) => console.log(text)}
                altFontFamily="muli"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="vname"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor={colors.darkGreenTitle}
                submitButtonText="Chọn"
              />
            </View>
            {this.state.selectedCerts && this.state.selectedCerts.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
              >
                {this.state.selectedCerts.map((item) => (
                  <TouchableOpacity key={item}>
                    <View style={styles.smallbutton}>
                      <MuliText style={{ color: '#ffffff' }}>
                        {
                          this.state.certs.find((skill) => skill.id == item)
                            .vname
                        }
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.searchSitters}
              // onPress={this.getSkillList}
            >
              <MuliText style={{ color: 'white', fontSize: 11 }}>
                Tìm kiếm
              </MuliText>
            </TouchableOpacity>
          </View>
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
  totalPrice: {
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
  smallbutton: {
    flex: 1,
    height: 30,
    backgroundColor: colors.lightGreen,
    margin: 8,
    padding: 5,
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#2E272B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
  },
  mediumTitle: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },
  inviteButton: {
    marginTop: 14,
  },
  bsitterName: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.darkGreenTitle,
  },
  sitterImage: {
    width: 55,
    height: 55,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  bsitterContainer: {
    marginVertical: 8,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 10,
  },
  lowerText: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  ItemSearchSitterItem: {
    flexDirection: 'row',
  },
});
