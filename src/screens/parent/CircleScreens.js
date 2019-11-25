/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import colors from 'assets/Color';
import { getCircle } from 'api/circle.api';
import { retrieveToken } from 'utils/handleToken';
import CircleItem from 'screens/parent/CircleItem';
import CircleHiredSitter from 'screens/parent/CircleHiredSitter';
import CircleFriendSitter from 'screens/parent/CircleFriendSitter';
import Toast, { DURATION } from 'react-native-easy-toast';

export default class CircleScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      circle: [],
      hiredSitter: [],
      friendSitter: [],
      hidedCircle: true,
      hidedHiredSitter: true,
      hidedFriendSitter: true,
    };
  }

  componentWillMount() {
    this.getCircle();
  }

  getCircle() {
    retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });

    getCircle()
      .then((result) => {
        this.setState({
          circle: result.data.circle,
          hiredSitter: result.data.hiredSitter,
          friendSitter: result.data.friendSitter,
        });
      })
      .catch((error) => {
        console.log('Duong: CircleScreens -> getCircle -> error', error);
      });
  }

  hidedCircle() {
    if (this.state.hidedCircle) {
      this.setState({ hidedCircle: false });
    } else {
      this.setState({ hidedCircle: true });
    }
  }

  hidedHiredSitter() {
    if (this.state.hidedHiredSitter) {
      this.setState({ hidedHiredSitter: false });
    } else {
      this.setState({ hidedHiredSitter: true });
    }
  }

  hidedFriendSitter() {
    if (this.state.hidedFriendSitter) {
      this.setState({ hidedFriendSitter: false });
    } else {
      this.setState({ hidedFriendSitter: true });
    }
  }

  showToast() {
    this.refs.toast.show("Cặc", DURATION.LENGTH_LONG);
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#dfe6e9' }}>
        <Toast ref="toast" position="top" />
        {/* Header vòng tròn tin tưởng của tôi */}
        {this.state.circle.length > 0 ? (
          <View style={styles.firstHeaderContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedCircle();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={24}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Những phụ huynh mà tôi biết ({this.state.circle.length})
              </MuliText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleItem}
              onPress={() =>
                this.props.navigation.navigate('AddToCircle', {
                  ownerId: this.state.userId,
                  onGoBack: () => {
                    this.getCircle();
                  },
                })
              }
            >
              <MuliText style={{ color: colors.done, fontSize: 11 }}>Thêm</MuliText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.firstHeaderContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="ios-person"
                size={24}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Những phụ huynh mà tôi biết ({this.state.circle.length})
              </MuliText>
            </View>
            <TouchableOpacity
              style={styles.circleItem}
              onPress={() =>
                this.props.navigation.navigate('AddToCircle', {
                  ownerId: this.state.userId,
                })
              }
            >
              <MuliText style={{ color: colors.done, fontSize: 11 }}>
                Thêm
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item vòng tròn tin tưởng của tôi */}
        {this.state.hidedCircle && this.state.circle.length > 0 && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            {this.state.circle.length > 0 && (
              <FlatList
                horizontal={true}
                data={this.state.circle}
                renderItem={({ item }) => <CircleItem item={item} />}
                keyExtractor={(item) => item.friend.user.id.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {/* Header người giữ trẻ đã thuê */}
        {this.state.hiredSitter.length > 0 && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedHiredSitter();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={19}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Người giữ trẻ đã thuê ({this.state.hiredSitter.length})
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item của người giữ trẻ đã thuê */}
        {this.state.hidedHiredSitter && this.state.hiredSitter.length > 0 && (
          <View>
            {/* Item chi tiết */}
            {this.state.hiredSitter.length > 0 && (
              <FlatList
                style={styles.itemContainer}
                data={this.state.hiredSitter}
                renderItem={({ item }) => <CircleHiredSitter item={item} />}
                keyExtractor={(item) => item.userId.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {/* Header bạn bè */}
        {this.state.friendSitter.length > 0 && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedFriendSitter();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={19}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Người trông trẻ bạn bè đã thuê ({this.state.friendSitter.length}
                )
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item bạn bè */}
        {this.state.hidedFriendSitter && this.state.friendSitter.length > 0 && (
          <View>
            {/* Item chi tiết */}
            {this.state.friendSitter.length > 0 && (
              <FlatList
                style={styles.itemContainer}
                data={this.state.friendSitter}
                renderItem={({ item }) => <CircleFriendSitter item={item} />}
                keyExtractor={(item) => item.userId.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}
      </ScrollView>
    );
  }
}
CircleScreens.navigationOptions = {
  title: 'Vòng tròn tin tưởng',
};
const styles = StyleSheet.create({
  circleItem: {
    marginLeft: 'auto',
    marginTop: 14,
    color: colors.lightGreen,
    marginRight: 10,
  },
  itemContainer: {
    backgroundColor: colors.white,
  },
  firstHeaderContainer: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors.gray,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: colors.white,
    height: 40,
  },
  headerContainer: {
    borderColor: colors.gray,
    borderWidth: 0,
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: colors.white,
    height: 40,
  },
  headerText: {
    marginTop: 18,
    fontSize: 10,
    color: colors.darkGreenTitle,
    marginLeft: 10,
  },
});
