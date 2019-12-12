import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
import RepeatedItem from 'screens/setting/RepeatedItem';
import Loader from 'utils/Loader';
import { listRepeatedRequest } from 'api/repeatedRequest.api';

const { height } = Dimensions.get('window');

export class RepeatedRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: null,
      userId: 0,
      loading: false,
      refreshing: false,
    };
  }

  async componentDidMount() {
    this.getRepeatedRequest();
  }

  getRepeatedRequest = async () => {
    await retrieveToken().then(async (res) => {
      const { userId } = res;
      await this.setState({ userId });
    });

    const { userId } = this.state;
    await listRepeatedRequest(userId).then((res) => {
      if (res.data) {
        const requests = res.data;

        this.setState({ requests });
      }
    });
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getRepeatedRequest().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const { requests, refreshing, loading } = this.state;
    const { noRequest, noRequestText, noRequestImage } = styles;

    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: colors.gray,
        }}
      >
        <Loader loading={loading} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={requests}
          renderItem={({ item }) => <RepeatedItem request={item} />}
          keyExtractor={(item) => item.id.toString()}
          style={{ backgroundColor: colors.homeColor }}
          ListEmptyComponent={
            <View style={noRequest}>
              <MuliText style={noRequestText}>
                Bạn không có yêu cầu lặp lại nào cả
              </MuliText>
              <Image
                source={require('assets/images/no-pending.png')}
                style={noRequestImage}
              />
            </View>
          }
        />
      </View>
    );
  }
}

export default RepeatedRequest;

RepeatedRequest.navigationOptions = {
  title: 'Lịch ḷặp lại',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },

  statusBoxConfirm: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 40,
    padding: 10,
  },
  noRequest: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    height: height,
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 30,
    paddingTop: 20,
    fontSize: 18,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
  },
  noRequestImage: {
    width: 261,
    height: 236,
    marginVertical: 20,
  },
  leftInformation: {
    margin: 15,
    paddingHorizontal: 5,
    flex: 1,
  },
  date: {
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
