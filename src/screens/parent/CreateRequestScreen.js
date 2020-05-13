/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
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
  TextInput,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons } from '@expo/vector-icons/';
import colors from 'assets/Color';
import {
  updateRequest,
  getOverlapSittingRequest,
} from 'api/sittingRequest.api';
import { CheckBox } from 'native-base';
import { formater } from 'utils/MoneyFormater';
import Toast from 'react-native-root-toast';
import AlertPro from 'react-native-alert-pro';
import { getPricings } from 'api/pricing.api';
import { getHolidays } from 'api/holiday.api';
import { getConfigs } from 'api/configuration.api';
import { getUser } from 'api/user.api';
import { Switch } from 'react-native-gesture-handler';
import { getCerts } from 'api/cert.api';
import { getSkills } from 'api/skill.api';
import Modal from 'react-native-modal';
import MultiSelect from 'react-native-multiple-select';

class CreateRequestScreen extends Component {
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
      childrenNumber: 0,
      minAgeOfChildren: 0,
      children: [],
      totalPrice: 0,
      overlapRequests: [],
      noticeTitle: '',
      noticeMessage: '',
      cancelAlert: '',
      confirmAlert: '',
      showConfirm: false,
      pricings: [],
      holidays: [],
      officeHourStart: null,
      officeHourEnd: null,
      selectedChildren: [],
      messageOvertime:
        'Giá tăng do nhu cầu công việc tăng cao vào thời điểm này',
      showOvertime: false,
      isRepeated: false,
      isModalVisible: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      selectedSkills: [],
      selectedCerts: [],
      skills: [],
      certs: [],
      requiredSkills: [{ skillId: 1 }],
      requiredCerts: [],
    };
    // console.log(this.props.navigation.getParam('selectedDate'));
  }

  async componentWillMount() {
    this.getDataAccordingToRole();

    await getUser().then((parent) => {
      this.setState({
        loggedUser: parent,
        sittingAddress: parent.address,
        children: parent.parent.children,
      });
    });

    await getCerts().then((certs) => {
      certs.status == 200 ? this.setState({ certs: certs.data }) : [];
    });

    await getSkills().then((skills) => {
      skills.status == 200 ? this.setState({ skills: skills.data }) : [];
    });

    await getPricings().then((pricings) => {
      this.setState({ pricings });
    });

    await getHolidays().then((holidays) => {
      this.setState({ holidays });
    });

    await getConfigs().then((configs) => {
      this.setState({
        officeHourStart: configs.officeHourStart,
        officeHourEnd: configs.officeHourEnd,
      });
    });
  }

  onSelectedSkillsChange = (selectedSkills) => {
    this.updatePrice();
    this.setState({ selectedSkills });
  };

  onSelectedCertsChange = (selectedCerts) => {
    this.updatePrice();
    this.setState({ selectedCerts });
  };

  getChildrenDescriptions = () => {
    let descriptions = [];
    this.state.children.map((item) => {
      this.state['description_' + item.name]
        ? (descriptions = [
            ...descriptions,
            {
              id: item.id,
              name: item.name,
              image: item.image,
              age: item.age,
              descriptions: this.state['description_' + item.name],
            },
          ])
        : [];
    });

    return descriptions;
  };

  checkDescription = () => {
    let descriptions = [];
    this.state.children.map((item) => {
      this.state['description_' + item.name]
        ? (descriptions = [
            ...descriptions,
            {
              id: item.id,
              name: item.name,
              image: item.image,
              age: item.age,
              descriptions: this.state['description_' + item.name],
            },
          ])
        : [];
    });

    if (descriptions && descriptions.length > 0) return true;

    return false;
  };

  showToast = (message) => {
    message
      ? Toast.show(message, {
          duration: Toast.durations.LONG,
          position: 60,
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

  getSkillList = () => {
    const { skills, selectedSkills, selectedCerts } = this.state;

    const requiredSkills = selectedSkills.map((skill) => ({
      skillId: skill,
    }));
    const requiredCerts = selectedCerts.map((cert) => ({
      certId: cert,
    }));
    const des = this.getChildrenDescriptions();
  };

  beforeRecommend = () => {
    if (this.state.startTime == null || this.state.endTime == null) {
      // this.refs.toast.show(
      //   'Vui lòng chọn thời gian trông trẻ',
      //   // DURATION.LENGTH_LONG,
      // );

      this.showToast('Vui lòng chọn thời gian trông trẻ');
      return;
    }

    const start = moment(this.state.startTime, 'HH:mm');
    const end = moment(this.state.endTime, 'HH:mm').subtract(1, 'hour');
    if (end.isSameOrBefore(start)) {
      // this.refs.toast.show(
      //   'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng',
      //   // DURATION.LENGTH_LONG,
      // );
      this.showToast(
        'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng',
      );
      return;
    }

    if (this.state.childrenNumber == 0) {
      // this.refs.toast.show(
      //   'Vui lòng chọn ít nhất một trẻ',
      //   DURATION.LENGTH_LONG,
      // );
      this.showToast('Vui lòng chọn ít nhất một trẻ');
      return;
    }

    if (!this.checkDescription()) {
      this.showToast('Vui lòng thêm mô tả cho trẻ');

      return;
    }

    const {
      userId,
      sittingDate,
      startTime,
      endTime,
      sittingAddress,
      childrenNumber,
      minAgeOfChildren,
      totalPrice,
    } = this.state;

    const request = {
      requestId: this.state.requestId != 0 ? this.state.requestId : 0,
      createdUser: userId,
      sittingDate: sittingDate,
      startTime: startTime,
      endTime: endTime,
      sittingAddress: sittingAddress,
      childrenNumber: childrenNumber,
      minAgeOfChildren: minAgeOfChildren,
      status: 'PENDING',
      totalPrice: totalPrice,
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
        console.log('error', error);
        if (error.response.status && error.response.status == 409) {
          // this.refs.toast.show(
          //   'Không thể đặt yêu cầu cho ngày giờ ở quá khứ, vui lòng chọn lại.',
          //   DURATION.LENGTH_LONG,
          // );
          this.showToast(
            'Không thể đặt yêu cầu cho ngày giờ ở quá khứ, vui lòng chọn lại.',
          );
        } else {
          // this.refs.toast.show(
          //   'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
          //   DURATION.LENGTH_LONG,
          // );
          this.showToast('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      });
  };

  checkRepeatedRequest = () => {
    const { mon, tue, wed, thu, fri, sat, sun, isRepeated } = this.state;
    const repeatedDays = [];

    if (mon) repeatedDays.push('MON');
    if (tue) repeatedDays.push('TUE');
    if (wed) repeatedDays.push('WED');
    if (thu) repeatedDays.push('THU');
    if (fri) repeatedDays.push('FRI');
    if (sat) repeatedDays.push('SAT');
    if (sun) repeatedDays.push('SUN');

    const stringRepeatedDays = repeatedDays.join();

    const body = {
      isRepeated: isRepeated,
      repeatedDays: stringRepeatedDays,
    };
    // goi api luu lich lap lai o day nhan body lam du lieu dau vao

    // hoac chi can lay du lieu tu ham nay tra ra de dua vao ham to Recommend Screen

    return body;
  };

  toRecommendScreen = () => {
    const repeatedData = this.checkRepeatedRequest();
    console.log(
      'PHUC: CreateRequestScreen -> toRecommendScreen -> repeatedData',
      repeatedData,
    );

    const {
      requestId,
      userId: createdUser,
      sittingDate,
      startTime,
      endTime,
      sittingAddress,
      childrenNumber,
      minAgeOfChildren,
      totalPrice,
      isRepeated,
      selectedSkills,
      selectedCerts,
      requiredSkills,
    } = this.state;

    const requiredSkillsPicked = selectedSkills.map((skill) => ({
      skillId: skill,
    }));

    const requiredCertsPicked = selectedCerts.map((cert) => ({
      certId: cert,
    }));

    const childrenDescription = JSON.stringify(this.getChildrenDescriptions());

    const skillArr = this.state.skills.filter((item) =>
      selectedSkills.includes(item.id),
    );

    const certArr = this.state.certs.filter((item) =>
      selectedCerts.includes(item.id),
    );

    const request = {
      requestId: requestId != 0 ? requestId : 0,
      createdUser,
      sittingDate,
      startTime,
      endTime,
      sittingAddress,
      childrenNumber,
      minAgeOfChildren,
      status: 'PENDING',
      totalPrice,
      requiredSkills:
        requiredSkillsPicked.length > 0 ? requiredSkillsPicked : requiredSkills,
      requiredCerts: requiredCertsPicked.length > 0 ? requiredCertsPicked : [],
      childrenDescription,
      repeatedSkills: JSON.stringify(skillArr),
      repeatedCerts: JSON.stringify(certArr),
    };

    if (isRepeated) {
      this.props.navigation.navigate('Recommend', {
        requestId,
        request,
        repeatedData,
        onGoBack: (requestId) => this.setState({ requestId: requestId }),
      });
    } else {
      this.props.navigation.navigate('Recommend', {
        requestId,
        request,
        onGoBack: (requestId) => this.setState({ requestId: requestId }),
      });
    }

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
      totalPrice: this.state.totalPrice,
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

  getDataAccordingToRole = async () => {
    await retrieveToken().then((res) => {
      const { userId, roleId } = res;
      this.setState({ userId, roleId });
    });
  };

  toggleHidden = async (key) => {
    // eslint-disable-next-line no-unused-expressions
    key.checked == null ? (key.checked = true) : (key.checked = !key.checked);
    this.forceUpdate();
    await this.calculate();
    this.updatePrice();
    this.getChildrenDescriptions();
  };

  calculate = async () => {
    let childCounter = 0;
    let minAge = 99;
    const selectedChildren = [];
    this.state.children.forEach((element) => {
      if (element.checked) {
        childCounter += 1;
        if (minAge > element.age) minAge = element.age;

        selectedChildren.push(element);
      }
    });

    this.setState({
      childrenNumber: childCounter,
      minAgeOfChildren: minAge,
      selectedChildren,
    });
  };

  updatePrice = async () => {
    if (
      this.state.sittingDate == null ||
      this.state.startTime == null ||
      this.state.endTime == null ||
      this.state.selectedChildren.length <= 0
    ) {
      this.setState({ totalPrice: 0 });
      return;
    }

    let totalPrice = 0;

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    const isHolyday = this.isHolyday(sittingDate);

    // khoảng thời gian trong giờ hành chính của request này (phút)
    const officeHours = await this.getOfficeHours();
    // khoảng thời gian ngoài giờ hành chính của request này (phút)
    const OTHours = await this.getOTHours();
    const totalDuration = officeHours + OTHours;
    const officeHoursPercentage = officeHours / 60;
    const OTHoursPercentage = OTHours / 60;
    const totalDurationPercentage = totalDuration / 60;

    this.state.selectedChildren.forEach((child) => {
      if (child.age < 0.6) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[3].baseAmount *
            this.state.pricings[3].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[3].baseAmount *
            this.state.pricings[3].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[3].baseAmount * officeHoursPercentage;
        }
      } else if (child.age < 1.8) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[2].baseAmount *
            this.state.pricings[2].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[2].baseAmount *
            this.state.pricings[2].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[2].baseAmount * officeHoursPercentage;
        }
      } else if (child.age <= 6) {
        if (isHolyday) {
          totalPrice +=
            this.state.pricings[1].baseAmount *
            this.state.pricings[1].holiday *
            totalDurationPercentage;
        } else {
          totalPrice +=
            this.state.pricings[1].baseAmount *
            this.state.pricings[1].overtime *
            OTHoursPercentage;

          totalPrice +=
            this.state.pricings[1].baseAmount * officeHoursPercentage;
        }
      }

      const { selectedCerts, selectedSkills } = this.state;

      const skillArr = this.state.skills.filter((item) =>
        selectedSkills.includes(item.id),
      );

      const certArr = this.state.certs.filter((item) =>
        selectedCerts.includes(item.id),
      );

      const skillsPrice = this.skillPriceAdditional(
        skillArr,
        this.state.pricings[4].baseAmount,
      );

      totalPrice += skillsPrice;

      const certsPrice = this.certPriceAdditional(
        certArr,
        this.state.pricings[5].baseAmount,
      );

      totalPrice += certsPrice;

      this.setState({ totalPrice: Math.round(totalPrice) });
    });
  };

  skillPriceAdditional = (arrSkills, baseValue) => {
    let additionalPrice = 0;
    if (arrSkills && arrSkills.length > 0) {
      arrSkills.forEach((item) => (additionalPrice += baseValue * item.point));
    }

    return additionalPrice;
  };

  certPriceAdditional = (arrCerts, baseValue) => {
    let additionalPrice = 0;
    if (arrCerts && arrCerts.length > 0) {
      arrCerts.forEach((item) => (additionalPrice += baseValue * item.point));
    }

    return additionalPrice;
  };

  getOfficeHours = async () => {
    let officeHours = 0;

    const startTime = moment(this.state.startTime, 'HH:mm');
    const endTime = moment(this.state.endTime, 'HH:mm');
    const officeHStart = moment(this.state.officeHourStart, 'HH:mm');
    const officeHEnd = moment(this.state.officeHourEnd, 'HH:mm');

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    // Thứ 7, CN
    if (sittingDate.day() == 0 || sittingDate.day() == 6) {
      return officeHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      officeHours = endTime.diff(startTime, 'minutes');
      return officeHours;
    }

    if (
      startTime.isSameOrBefore(officeHStart) &&
      endTime.isSameOrAfter(officeHEnd)
    ) {
      officeHours = officeHEnd.diff(officeHStart, 'minutes');
      return officeHours;
    }

    if (
      startTime.isSameOrBefore(officeHStart) &&
      endTime.isSameOrBefore(officeHStart)
    ) {
      officeHours = 0;
      return officeHours;
    }

    if (
      startTime.isSameOrAfter(officeHEnd) &&
      endTime.isSameOrAfter(officeHEnd)
    ) {
      officeHours = 0;
      return officeHours;
    }

    if (
      startTime.isSameOrBefore(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      officeHours = endTime.diff(officeHStart, 'minutes');
      return officeHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrAfter(officeHEnd)
    ) {
      officeHours = officeHEnd.diff(startTime, 'minutes');
      return officeHours;
    }
  };

  getOTHours = async () => {
    let OTHours = 0;

    const startTime = moment(this.state.startTime, 'HH:mm');
    const endTime = moment(this.state.endTime, 'HH:mm');
    const officeHStart = moment(this.state.officeHourStart, 'HH:mm');
    const officeHEnd = moment(this.state.officeHourEnd, 'HH:mm');

    const sittingDate = moment(this.state.sittingDate, 'YYYY-MM-DD');
    // Thứ 7, CN
    if (sittingDate.day() == 0 || sittingDate.day() == 6) {
      OTHours = endTime.diff(startTime, 'minutes');
      return OTHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      return OTHours;
    }

    if (
      startTime.isSameOrBefore(officeHStart) &&
      endTime.isSameOrAfter(officeHEnd)
    ) {
      OTHours += officeHStart.diff(startTime, 'minutes');

      OTHours += endTime.diff(officeHEnd, 'minutes');
      return OTHours;
    }

    if (
      (startTime.isSameOrBefore(officeHStart) &&
        endTime.isSameOrBefore(officeHStart)) ||
      (startTime.isSameOrAfter(officeHEnd) && endTime.isSameOrAfter(officeHEnd))
    ) {
      OTHours += endTime.diff(startTime, 'minutes');
      return OTHours;
    }

    if (
      startTime.isSameOrBefore(officeHStart) &&
      endTime.isSameOrBefore(officeHEnd)
    ) {
      OTHours += officeHStart.diff(startTime, 'minutes');
      return OTHours;
    }

    if (
      startTime.isSameOrAfter(officeHStart) &&
      endTime.isSameOrAfter(officeHEnd)
    ) {
      OTHours += endTime.diff(officeHEnd, 'minutes');
      return OTHours;
    }
  };

  isHolyday = (date) => {
    let result = false;
    const sittingDate = date.format('DD/MM');
    this.state.holidays.forEach((element) => {
      if (sittingDate == element.date) {
        result = true;
        return;
      }
    });

    return result;
  };

  toggleModalCreateRequest = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    const {
      noticeTitle,
      noticeMessage,
      cancelAlert,
      confirmAlert,
      sittingDate,
      startTime,
      endTime,
      isModalVisible,
      selectedSkills,
      selectedCerts,
    } = this.state;

    return (
      <ScrollView>
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
          style={{}}
        >
          <View
            style={{
              flex: 0.4,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <MuliText style={{ fontSize: 18, fontWeight: 'bold' }}>
                Đặt lịch lặp lại là gì ?
              </MuliText>
            </View>
            <MuliText
              style={{ marginHorizontal: 15, marginVertical: 7, fontSize: 12 }}
            >
              Tính năng này dành cho khách hàng có nhu cầu TRÔNG TRẺ CỐ ĐỊNH vào
              các ngày trong tuần.
            </MuliText>
            <MuliText
              style={{ marginHorizontal: 15, marginVertical: 7, fontSize: 12 }}
            >
              Hệ thống sẽ tự động đăng việc vào các ngày bạn đã chọn. Bạn có thể
              chủ động thay đổi, dừng hoặc tiếp tục lịch lặp lại tại "Việc đã
              đăng" -> "Lặp lại"
            </MuliText>
            <MuliText
              style={{ marginHorizontal: 15, marginVertical: 7, fontSize: 12 }}
            >
              Đối với công việc đã được đăng lên bạn vui lòng thao tác trực tiếp
              trên từng công việc
            </MuliText>
            <TouchableOpacity
              onPress={() => {
                this.toggleModalCreateRequest();
              }}
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MuliText style={{ color: colors.star }}>Đồng ý</MuliText>
              </View>
            </TouchableOpacity>
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
                maxDate="2020-12-30"
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
                // androidMode="spinner"
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
                // androidMode="spinner"
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
          <View style={styles.repeatedRequest}>
            <View style={{ flex: 1 }}>
              <MuliText style={{ color: colors.loginText }}>
                Lặp lại hàng tuần
              </MuliText>
              <TouchableOpacity
                onPress={() => {
                  this.toggleModalCreateRequest();
                }}
              >
                <MuliText style={{ fontSize: 10, color: colors.lightGreen }}>
                  Nghĩa là gì ?
                </MuliText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'flex-end',
                flex: 1,
              }}
            >
              <Switch
                value={this.state.isRepeated}
                onValueChange={() => {
                  if (!this.state.isRepeated) {
                    this.toggleModalCreateRequest();
                  }
                  this.setState({
                    isRepeated: !this.state.isRepeated,
                  });
                }}
              />
            </View>
          </View>

          {this.state.isRepeated ? (
            <View style={styles.repeatedRequest}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#ecf0f1',
                  flex: 1,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ sun: !this.state.sun })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sun ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      CN
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ mon: !this.state.mon })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.mon ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T2
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ tue: !this.state.tue })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.tue ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T3
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ wed: !this.state.wed })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.wed ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T4
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ thu: !this.state.thu })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.thu ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T5
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ fri: !this.state.fri })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.fri ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T6
                    </MuliText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({ sat: !this.state.sat })}
                >
                  <View style={{ alignItems: 'center' }}>
                    <MuliText
                      style={{
                        color: this.state.sat ? colors.lightGreen : '#95a5a6',
                      }}
                    >
                      T7
                    </MuliText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row' }}>
            {this.state.children != null ? (
              <View style={styles.detailContainerChild}>
                <MuliText style={styles.headerTitleChild}>
                  Trẻ của bạn:
                </MuliText>
                <View style={styles.detailPictureContainer}>
                  {this.state.children.map((item) => (
                    <TouchableOpacity
                      key={item.id.toString()}
                      onPress={async () => {
                        await this.toggleHidden(item);
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
          {this.state.children && this.state.children.length > 0 ? (
            <View>
              {this.state.children.map((child) => (
                <View key={child.id.toString()}>
                  {child.checked ? (
                    <View>
                      <MuliText style={styles.headerTitle}>
                        {child.name}
                      </MuliText>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignContent: 'space-between',
                        }}
                      >
                        <View
                          style={{
                            alignItems: 'center',
                            margin: 5,
                          }}
                        >
                          <Image
                            source={{ uri: child.image }}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 120 / 2,
                              overflow: 'hidden',
                            }}
                          />
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            margin: 5,
                          }}
                        >
                          <MuliText>Độ tuổi: {child.age}</MuliText>
                        </View>
                      </View>
                      <View>
                        <MuliText style={styles.mediumTitle}>
                          Mô tả công việc cho {child.name}
                        </MuliText>
                        <MuliText style={styles.mediumSubTitle}>
                          vd: bé có sốt nhẹ, bé đã có sẵn đồ ăn, ...
                        </MuliText>
                        <TextInput
                          multiline={true}
                          style={{
                            marginTop: 10,
                            height: 80,
                            borderColor: 'gray',
                            borderWidth: 1,
                            padding: 5,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            borderBottomLeftRadius: 5,
                          }}
                          onChangeText={(text) =>
                            this.setState({
                              ['description_' + child.name]: text,
                            })
                          }
                          value={this.state['description_' + child.name]}
                        />
                      </View>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View />
          )}
          <View style={{ marginHorizontal: 10 }}>
            <MuliText style={styles.headerTitle}>Kỹ năng & Bằng cấp</MuliText>
            <MuliText style={{ marginVertical: 10 }}>
              Giữ trẻ là mục mặc định trong kỹ năng và bằng cấp.
            </MuliText>
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
                  <TouchableOpacity key={item.toString()}>
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
          <View>
            <MuliText style={styles.headerTitle}>Thanh toán</MuliText>
            <View style={styles.priceContainer}>
              <MuliText style={styles.contentInformation}>
                Tổng tiền thanh toán:
              </MuliText>
              <MuliText style={styles.price}>
                {formater(this.state.totalPrice)} Đồng
              </MuliText>
            </View>
          </View>
          {this.state.requestId == 0 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.beforeRecommend}
                // onPress={this.getSkillList}
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

export default CreateRequestScreen;

CreateRequestScreen.navigationOptions = {
  title: 'Tạo yêu cầu giữ trẻ',
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
  repeatedRequest: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
    fontSize: 12,
  },
  moreCriteria: {
    marginTop: 20,
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
  mediumSubTitle: {
    marginHorizontal: 10,
    fontSize: 10,
    color: colors.darkGreenTitle,
    fontWeight: '800',
  },
  mediumTitle: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
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
});
