/* eslint-disable react/no-string-refs */
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

export default class AddToCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: 0,
      code: null,
      friendId: 0,
      friend: null,
    };
  }

  componentWillMount() {
    const ownerId = this.props.navigation.getParam('ownerId');
    this.setState({ ownerId });
  }

  findParent() {
    findByCode(this.state.userId, this.state.code)
      .then((result) => {
        console.log(result);
        this.setState({ friend: result.data });
      })
      .catch((error) => {
        console.log('Duong: AddToCircle -> findParent -> error', error);
      });
  }

  addToCircle() {
    create(this.state.ownerId, this.state.friendId)
      .then((result) => {
        this.setState((prevState) => ({
          friend: Object.assign(prevState.friend, { isInvited: true }),
        }));
        console.log('a');
        this.refs.toast.show('Tạo thành công', DURATION.LENGTH_LONG);
      })
      .catch((error) => {
        console.log('Duong: AddToCircle -> addToCircle -> error', error);
        this.refs.toast.show('Mã trùng', DURATION.LENGTH_LONG);
      });
  }

  render() {
    return (
      <ScrollView>
        <View>
          <Toast ref="toast" position="top" />
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            value={this.state.code}
            onChangeText={(code) => this.setState({ code })}
            placeholder="Nhập mã cần tìm"
          />
          {/* {this.state.disableCreate && ( */}
          <TouchableOpacity>
            <MuliText onPress={() => this.findParent()}>Tìm kiếm</MuliText>
          </TouchableOpacity>
          {/* )} */}
        </View>
        {this.state.friend != null && (
          <View style={styles.detailPictureContainer}>
            <Image
              source={this.state.detailPictureSitter}
              style={styles.profileImg}
            />
            <View style={styles.leftInformation}>
              <MuliText style={styles.pictureInformation}>Phụ huynh</MuliText>
              <MuliText style={{ fontSize: 15 }}>
                {this.state.friend.user.nickname}
              </MuliText>
            </View>
          </View>
        )}
        {this.state.friend != null && !this.state.friend.isInvited && (
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => this.addToCircle()}
          >
            <MuliText style={{ color: '#78ddb6', fontSize: 16 }}>Mời</MuliText>
          </TouchableOpacity>
        )}
        {this.state.friend != null && this.state.friend.isInvited && (
          <MuliText style={{ color: '#B81A1A', fontSize: 16 }}>Đã mời</MuliText>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detailPictureContainer: {
    flexDirection: 'row',
    marginTop: 15,
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
});
