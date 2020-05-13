/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import colors from 'assets/Color';
import { getCircle } from 'api/circle.api';
import { retrieveToken } from 'utils/handleToken';
import CircleItem from 'screens/parent/CircleItem';
import CircleSitterItem from 'screens/parent/CircleSitterItem';
import CircleHiredSitter from 'screens/parent/CircleHiredSitter';
import CircleFriendSitter from 'screens/parent/CircleFriendSitter';
import Toast, { DURATION } from 'react-native-easy-toast';
import { withNavigationFocus } from 'react-navigation';

class CircleScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      circle: [],
      hiredSitter: [],
      friendSitter: [],
      hidedCircle: true,
      hidedSitterCircle: true,
      hidedHiredSitter: false,
      hidedFriendSitter: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getCircle();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isFocused != this.props.isFocused) {
      if (this.props.isFocused) {
        this.getCircle();
      }
    }
  }

  getCircle = async () => {
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });

    const { userId } = this.state;

    getCircle(userId)
      .then((result) => {
        const destructureCircle =
          result.data.circle && result.data.circle.length > 0
            ? result.data.circle.map((item) => {
                const user = {
                  isParent: item.isParent,
                  id: item.friend.id,
                  image: item.friend.image,
                  nickname: item.friend.nickname,
                };
                return user;
              })
            : [];
        const circle = this.getUnique(destructureCircle, 'id');
        this.setState({
          // circle: circle,
          circle: circle,
          hiredSitter: result.data.hiredSitter,
          friendSitter: result.data.friendSitter,
        });
      })
      .catch((error) => {
        console.log('Duong: CircleScreens -> getCircle -> error', error);
      });
  };

  getUnique = (arr, comp) => {
    const unique = arr
      .map((e) => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  };

  _onRefresh = () => {
    // this.setState({ loading: true });
    this.getCircle();
  };

  hidedCircle() {
    if (this.state.hidedCircle) {
      this.setState({ hidedCircle: false });
    } else {
      this.setState({ hidedCircle: true });
    }
  }

  hidedSitterCircle() {
    if (this.state.hidedSitterCircle) {
      this.setState({ hidedSitterCircle: false });
    } else {
      this.setState({ hidedSitterCircle: true });
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

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        style={{ backgroundColor: colors.white }}
      >
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
                Phụ huynh trong vòng tròn tin tưởng
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
              <MuliText style={{ color: colors.done, fontSize: 11 }}>
                Thêm
              </MuliText>
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
                Phụ huynh trong vòng tròn tin tưởng
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
                keyExtractor={(item) => item.id.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {this.state.circle.length > 0 ? (
          <View style={styles.firstHeaderContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedSitterCircle();
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
                Người giữ trẻ trong vòng tròn tin tưởng
              </MuliText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleItem}
              onPress={() => this.props.navigation.navigate('SearchSitter')}
            >
              <MuliText style={{ color: colors.done, fontSize: 11 }}>
                Thêm
              </MuliText>
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
                Người giữ trẻ trong vòng tròn tin tưởng
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

        {this.state.hidedSitterCircle && this.state.circle.length > 0 && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            {this.state.circle.length > 0 && (
              <FlatList
                horizontal={true}
                data={this.state.circle}
                renderItem={({ item }) => <CircleSitterItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}

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
                size={24}
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

export default withNavigationFocus(CircleScreens);

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
    marginHorizontal: 15,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors.gray,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: colors.white,
    height: 45,
  },
  headerContainer: {
    marginHorizontal: 15,
    borderColor: colors.gray,
    borderWidth: 0,
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: colors.white,
    height: 45,
  },
  headerText: {
    marginTop: 18,
    fontSize: 10,
    color: colors.darkGreenTitle,
    marginLeft: 10,
  },
});
