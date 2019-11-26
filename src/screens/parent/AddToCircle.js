/* eslint-disable react/no-string-refs */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { create } from 'api/circle.api';
import { findByCode } from 'api/parent.api';
import Toast, { DURATION } from 'react-native-easy-toast';
import colors from 'assets/Color';
import { Ionicons } from '@expo/vector-icons/';
import images from 'assets/images/images';

export default class AddToCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: 0,
      code: null,
      friend: null,
    };
  }

  componentWillMount() {
    const ownerId = this.props.navigation.getParam('ownerId');
    console.log('Duong: AddToCircle -> componentWillMount -> ownerId', ownerId);

    this.setState({ ownerId });
  }

  findParent() {
    findByCode(this.state.ownerId, this.state.code)
      .then((result) => {
        if (result.data.user.id == this.state.ownerId) {
          this.refs.toast.show(
            'Bạn không thể thêm chính mình',
            DURATION.LENGTH_LONG,
          );
        } else {
          this.setState({ friend: result.data });
        }
      })
      .catch((error) => {
        console.log('Duong: AddToCircle -> findParent -> error', error);
      });
  }

  addToCircle() {
    create(this.state.ownerId, this.state.friend.userId)
      .then((result) => {
        this.setState((prevState) => ({
          friend: Object.assign(prevState.friend, { isInvited: true }),
        }));
        this.refs.toast.show('Thêm thành công', DURATION.LENGTH_LONG);
      })
      .catch((error) => {
        console.log('Duong: AddToCircle -> addToCircle -> error', error);
        this.refs.toast.show('Đã xảy ra lỗi', DURATION.LENGTH_LONG);
      });
  }

  render() {
    return (
      <View>
        <Toast ref="toast" position="top" />
        <ScrollView>
          <View style={{ marginTop: 15, alignItems: 'center' }}>
            <MuliText style={styles.headerTitle}>Thêm phụ huynh</MuliText>
            <MuliText style={styles.grayOptionInformation}>
              Thêm phụ huynh mà bạn biết
            </MuliText>
          </View>
          <View style={styles.containerParent}>
            <View style={styles.detailContainerParent}>
              <TextInput
                style={styles.searchParent}
                value={this.state.code}
                onChangeText={(code) => this.setState({ code })}
                placeholder="Nhập mã cần tìm"
              />
            </View>
            {/* {this.state.disableCreate && ( */}
            <TouchableOpacity onPress={() => this.findParent()}>
              <Ionicons
                name="ios-search"
                size={25}
                style={{ marginLeft: 5 }}
                color={colors.darkGreenTitle}
              />
            </TouchableOpacity>
            {/* )} */}
          </View>
          <View style={styles.detailContainer}>
            {this.state.friend != null && (
              <View>
                <MuliText style={styles.headerFindText}>Tìm thấy</MuliText>
                <View style={styles.detailPictureContainer}>
                  <Image source={images.parent} style={styles.sitterImage} />
                  <View style={styles.leftInformation}>
                    <MuliText style={styles.pictureInformation}>
                      Phụ huynh
                    </MuliText>
                    <MuliText style={{ fontSize: 13 }}>
                      {this.state.friend.user.nickname}
                    </MuliText>
                    <MuliText>
                      Mã cá nhân: {this.state.friend.parentCode}
                    </MuliText>
                  </View>
                </View>
                <MuliText style={styles.addressText}>
                  Địa chỉ: {this.state.friend.user.address}
                </MuliText>
              </View>
            )}
            <View style={styles.rightInformation}>
              {this.state.friend && !this.state.friend.isInvited && (
                <TouchableOpacity
                  style={styles.inviteButton}
                  onPress={() => this.addToCircle()}
                >
                  <MuliText style={{ color: colors.lightGreen, fontSize: 12 }}>
                    Thêm
                  </MuliText>
                </TouchableOpacity>
              )}
              {this.state.friend != null && this.state.friend.isInvited && (
                <View style={styles.inviteButton}>
                  <MuliText style={{ color: colors.canceled, fontSize: 12 }}>
                    Đã thêm
                  </MuliText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerFindText: {
    marginTop: 15,
    marginLeft: 10,
    fontSize: 15,
    color: colors.gray,
  },
  addressText: {
    marginHorizontal: 20,
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
  },
  containerParent: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  grayOptionInformation: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: '200',
  },
  headerTitle: {
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginBottom: 10,
    fontWeight: '800',
  },
  inviteButton: {
    marginTop: 50,
  },
  detailContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  rightInformation: {
    marginLeft: 'auto',
    marginTop: 30,
  },
  leftInformation: {
    marginTop: 20,
    marginLeft: 5,
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.gray,
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
