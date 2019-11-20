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
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                borderRadius: 7,
                borderColor: 'gray',
                borderWidth: 1,
                marginHorizontal: 10,
              }}
            >
              <TextInput
                style={{
                  width: 290,
                  marginLeft: 10,
                  marginTop: 5,
                }}
                value={this.state.code}
                onChangeText={(code) => this.setState({ code })}
                placeholder="Nhập mã cần tìm"
              />
            </View>

            <TouchableOpacity style={{}} onPress={() => this.findParent()}>
              <Ionicons name="ios-search" size={30} color="#315f61" />
            </TouchableOpacity>
            {/* )} */}
          </View>
          <View style={styles.detailContainer}>
            {this.state.friend != null && (
              <View>
                <MuliText
                  style={{ marginTop: 10, marginLeft: 10, fontSize: 15 }}
                >
                  Tìm thấy
                </MuliText>
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
                    <MuliText style={{ width: 200 }}>
                      Địa chỉ: {this.state.friend.user.address}
                    </MuliText>
                  </View>
                  <View style={styles.rightInformation}>
                    {this.state.friend && !this.state.friend.isInvited && (
                      <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => this.addToCircle()}
                      >
                        <MuliText style={{ color: '#78ddb6', fontSize: 12 }}>
                          Thêm
                        </MuliText>
                      </TouchableOpacity>
                    )}
                    {this.state.friend && this.state.friend.isInvited && (
                      <MuliText style={{ color: '#B81A1A', fontSize: 12 }}>
                        Đã thêm
                      </MuliText>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    fontWeight: '200',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  inviteButton: {
    marginTop: 40,
  },
  detailContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  rightInformation: {
    marginLeft: 15,
    marginTop: 30,
  },
  leftInformation: {
    marginTop: 5,
    marginLeft: 5,
  },
  pictureInformation: {
    fontSize: 13,
    fontWeight: '400',
    color: '#bdc3c7',
  },
  sitterImage: {
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
