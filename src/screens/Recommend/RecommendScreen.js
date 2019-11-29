import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { recommend } from 'api/sittingRequest.api';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Bsitter from 'screens/Recommend/BsitterItem';
import colors from 'assets/Color';

export default class RecommendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedCount: 0,
      listMatched: [],
      recommendCount: 0,
      recommendList: [],
      requestId: 0,
      request: null,
      isModalVisible: true,
      isModalVisible2: true,
      loading: true,
    };
  }

  componentWillMount() {
    const requestId = this.props.navigation.getParam('requestId');
    const request = this.props.navigation.getParam('request');
    if (requestId && requestId != 0) {
      this.setState({ requestId }, () => this.getRecommendation());
    } else if (request !== undefined && request !== null) {
      this.setState({ request }, () => this.getRecommendation());
    } else {
      console.log('requestId not found - RecommendScreen');
    }
  }

  getRecommendation = async () => {
    if (
      this.state.requestId != 0 ||
      (this.state.request !== undefined && this.state.request != null)
    ) {
      const data = await recommend(this.state.requestId, this.state.request);
      this.setState({
        matchedCount: data.matchedCount,
        listMatched: data.listMatched,
        recommendCount: data.recommendCount,
        recommendList: data.recommendList,
        loading: false,
      });

      return data;
    }
    return [];
  };

  changeInviteStatus = (receiverId) => {
    this.setState((prevState) => ({
      listMatched: prevState.listMatched.map((el) =>
        el.userId == receiverId ? Object.assign(el, { isInvited: true }) : el,
      ),
      recommendList: prevState.recommendList.map((el) =>
        el.userId == receiverId ? Object.assign(el, { isInvited: true }) : el,
      ),
    }));
  };

  setRequestId = (requestId) => {
    this.setState({ requestId: requestId });
    this.props.navigation.state.params.onGoBack(requestId);
  };

  callRecommend() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  callRecommend2() {
    if (this.state.isModalVisible2) {
      this.setState({ isModalVisible2: false });
    } else {
      this.setState({ isModalVisible2: true });
    }
  }

  // netstat -ano | findstr 3000
  render() {
    const { loading } = this.state;
    return (
      <ScrollView style={{ backgroundColor: colors.homeColor }}>
        <View style={styles.container}>
          {this.state.recommendList.length > 0 ||
          this.state.listMatched.length > 0 ? (
            <View>
              {this.state.recommendList.length > 0 && (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.callRecommend();
                    }}
                  >
                    <View style={styles.headerSection}>
                      <Ionicons
                        name={
                          this.state.isModalVisible
                            ? 'ios-arrow-down'
                            : 'ios-arrow-up'
                        }
                        size={19}
                        style={{ marginBottom: -6, marginLeft: 15 }}
                        color={colors.darkGreenTitle}
                      />
                      <MuliText style={styles.textRecommend}>
                        Đề nghị ({this.state.recommendCount})
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                  {this.state.isModalVisible && (
                    <ScrollView style={styles.sectionContainer2}>
                      {this.state.recommendList &&
                        this.state.recommendList.length > 0 && (
                          <FlatList
                            data={this.state.recommendList}
                            renderItem={({ item }) => (
                              <Bsitter
                                changeInviteStatus={this.changeInviteStatus}
                                setRequestId={this.setRequestId}
                                requestId={this.state.requestId}
                                request={this.state.request}
                                item={item}
                              />
                            )}
                            keyExtractor={(item) => item.user.id.toString()}
                          />
                        )}
                    </ScrollView>
                  )}
                </View>
              )}

              {this.state.listMatched.length != 0 && (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.callRecommend2();
                    }}
                  >
                    <View style={styles.headerSection}>
                      <Ionicons
                        name={
                          this.state.isModalVisible2
                            ? 'ios-arrow-down'
                            : 'ios-arrow-up'
                        }
                        size={19}
                        style={{ marginBottom: -6, marginLeft: 15 }}
                        color={colors.darkGreenTitle}
                      />
                      <MuliText style={styles.textRecommend}>
                        Người giữ trẻ phù hợp ({this.state.matchedCount})
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                  {this.state.isModalVisible2 && (
                    <ScrollView style={styles.sectionContainer2}>
                      {this.state.listMatched &&
                        this.state.listMatched.length != 0 && (
                          <FlatList
                            data={this.state.listMatched}
                            renderItem={({ item }) => (
                              <Bsitter
                                changeInviteStatus={this.changeInviteStatus}
                                setRequestId={this.setRequestId}
                                requestId={this.state.requestId}
                                request={this.state.request}
                                item={item}
                              />
                            )}
                            keyExtractor={(item) => item.user.id.toString()}
                          />
                        )}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View>
              {loading ? (
                <ActivityIndicator size="large" />
              ) : (
                <MuliText
                  style={{
                    marginTop: 50,
                    color: colors.gray,
                    fontSize: 25,
                    marginHorizontal: 50,
                  }}
                >
                  Không tìm thấy người giữ trẻ phù hợp với lịch giữ trẻ của bạn
                </MuliText>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  notFindRecommend: {
    marginTop: 50,
    color: colors.gray,
    fontSize: 25,
    marginHorizontal: 50,
  },
  textRecommend: {
    fontSize: 13,
    color: colors.darkGreenTitle,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: colors.homeColor,
  },

  sectionContainer2: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  headerSection: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.gray,
    height: 60,
    alignItems: 'center',
    marginBottom: 10,
  },
});
